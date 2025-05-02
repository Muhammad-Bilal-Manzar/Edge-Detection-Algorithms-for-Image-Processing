from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from . import edge_algorithms
import base64

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    sobel_img, sobel_time = edge_algorithms.measure_performance(edge_algorithms.sobel_edge_detection, img)
    canny_img, canny_time = edge_algorithms.measure_performance(edge_algorithms.canny_edge_detection, img)
    prewitt_img, prewitt_time = edge_algorithms.measure_performance(edge_algorithms.prewitt_edge_detection, img)

    def encode(img):
        _, im_arr = cv2.imencode('.png', img)
        return base64.b64encode(im_arr).decode('utf-8')

    return JSONResponse(content={
        "sobel": {"image": encode(sobel_img), "time": sobel_time},
        "canny": {"image": encode(canny_img), "time": canny_time},
        "prewitt": {"image": encode(prewitt_img), "time": prewitt_time}
    })

