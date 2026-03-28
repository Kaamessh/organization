package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type ForecastRequest struct {
	Site string `json:"site"`
}

type NudgeRequest struct {
	HotspotID      string `json:"hotspot_id"`
	SuggestedGemID string `json:"suggested_gem_id"`
}

func main() {
	// Try loading .env if it exists
	godotenv.Load()

	http.HandleFunc("/api/forecast", handleForecast)
	http.HandleFunc("/api/deploy_nudge", handleDeployNudge)

	// Enable CORS matching React's local dev server port (5173)
	fmt.Println("🌟 AURA Backend Server starting on http://localhost:8080")
	http.ListenAndServe(":8080", corsMiddleware(http.DefaultServeMux))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// handleForecast forwards the request to the external Hugging Face FastAPI Space
func handleForecast(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	site := r.URL.Query().Get("site")
	if site == "" {
		http.Error(w, "Site query parameter is required", http.StatusBadRequest)
		return
	}

	// 1. Fetch current weather for Goa using API
	temp := 31.5
	rainMM := 0.0
	humidity := 65.0
	windSpeed := 12.0

	if openWeatherKey := os.Getenv("OPENWEATHER_API_KEY"); openWeatherKey != "" {
		// Fetch weather for Goa coordinates using metric units
		weatherURL := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?lat=15.2993&lon=74.1240&appid=%s&units=metric", openWeatherKey)
		
		client := &http.Client{Timeout: 5 * time.Second}
		if weatherResp, err := client.Get(weatherURL); err == nil && weatherResp.StatusCode == 200 {
			defer weatherResp.Body.Close()
			var res map[string]interface{}
			if err := json.NewDecoder(weatherResp.Body).Decode(&res); err == nil {
				if mainData, ok := res["main"].(map[string]interface{}); ok {
					if t, ok := mainData["temp"].(float64); ok { temp = t }
					if h, ok := mainData["humidity"].(float64); ok { humidity = h }
				}
				if windData, ok := res["wind"].(map[string]interface{}); ok {
					if s, ok := windData["speed"].(float64); ok { windSpeed = s }
				}
				if rainData, ok := res["rain"].(map[string]interface{}); ok {
					if r, ok := rainData["1h"].(float64); ok { rainMM = r }
				}
			}
		}
	}

	// 2. Transmit to Hugging Face FastAPI Space
	hfURL := os.Getenv("HUGGINGFACE_API_URL")
	if hfURL == "" {
		hfURL = "https://kaamessh-aura-crowd-engine.hf.space/predict"
	}

	now := time.Now()
	payload := map[string]interface{}{
		"site":        site,
		"ds":          now.Format("2006-01-02 15:00:00"),
		"temp":        temp,
		"rain_mm":     rainMM,
		"humidity":    humidity,
		"wind_speed":  windSpeed,
		"is_holiday":  0,
		"is_weekend":  0,
		"month":       int(now.Month()),
		"day_of_week": int(now.Weekday()),
		"hour":        now.Hour(),
	}
	jsonPayload, _ := json.Marshal(payload)

	resp, err := http.Post(hfURL, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil || resp.StatusCode != 200 {
		// Mock response if Hugging Face container is sleeping or unreachable
		w.Header().Set("Content-Type", "application/json")
		mockPred := 4500
		if site == "Fort Aguada" {
			mockPred = 1900
		}
		w.Write([]byte(fmt.Sprintf(`{"site": "%s", "predicted_visitors": %d, "status": "mock_fallback"}`, site, mockPred)))
		return
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

// handleDeployNudge uses the Supabase REST API to change is_active to true
func handleDeployNudge(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var reqData NudgeRequest
	if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		fmt.Println("⚠️ Missing Supabase keys in backend. Returning simulated success.")
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "simulated_success"}`))
		return
	}

	// Update the specific row where hotspot_id matches the request
	reqURL := fmt.Sprintf("%s/rest/v1/active_nudges?hotspot_id=eq.%s", supabaseURL, reqData.HotspotID)
	updatePayload := map[string]interface{}{
		"is_active":        true,
		"suggested_gem_id": reqData.SuggestedGemID,
		"updated_at":       time.Now().Format(time.RFC3339),
	}
	jsonPayload, _ := json.Marshal(updatePayload)

	req, _ := http.NewRequest("PATCH", reqURL, bytes.NewBuffer(jsonPayload))
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation") // Returns the updated row

	client := &http.Client{}
	resp, err := client.Do(req)
	
	if err != nil || (resp.StatusCode != 200 && resp.StatusCode != 204) {
		http.Error(w, "Failed to update Supabase", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "success"}`))
}
