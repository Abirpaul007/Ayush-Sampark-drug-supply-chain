from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
model = joblib.load("drug_demand_model.pkl")
le_drug = joblib.load("drug_encoder.pkl")
le_region = joblib.load("region_encoder.pkl")
residual_std = joblib.load("model_uncertainty.pkl")

@app.post("/predict-tender")
def predict_tender(data: dict):

    drug = data["drug"]
    region = data["region"]
    history = data["history"]  # must be 12 values
    year = data["year"]
    month = data["month"]

    if len(history) < 12:
        return {"error": "Minimum 12 months history required"}

    drug_enc = le_drug.transform([drug])[0]
    region_enc = le_region.transform([region])[0]

    lags = {
        "lag_1": history[-1],
        "lag_2": history[-2],
        "lag_3": history[-3],
        "lag_6": history[-6],
        "lag_12": history[0]
    }

    monthly_preds = []

    for _ in range(12):
        X = np.array([[
            year, month, drug_enc, region_enc,
            lags["lag_1"], lags["lag_2"],
            lags["lag_3"], lags["lag_6"], lags["lag_12"]
        ]])

        pred = float(model.predict(X)[0])
        monthly_preds.append(pred)

        # shift lags
        lags["lag_12"] = lags["lag_6"]
        lags["lag_6"] = lags["lag_3"]
        lags["lag_3"] = lags["lag_2"]
        lags["lag_2"] = lags["lag_1"]
        lags["lag_1"] = pred

        month += 1
        if month > 12:
            month = 1
            year += 1

    annual = sum(monthly_preds)
    upper = annual + 1.96 * residual_std
    tender_qty = int(upper * 1.2)

    return {
        "monthly_forecast": [int(x) for x in monthly_preds],
        "annual_demand": int(annual),
        "tender_quantity": tender_qty,
        "confidence": 0.95
    }
