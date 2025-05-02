import time
import numpy as np
from scipy.ndimage import convolve

def measure_performance(func, *args, **kwargs):
    start_time = time.time()
    result = func(*args, **kwargs)
    end_time = time.time()
    return result, round((end_time - start_time), 4)  

def to_grayscale(image):
    if len(image.shape) == 3:
        return np.dot(image[...,:3], [0.2989, 0.5870, 0.1140]).astype(np.float32)
    return image.astype(np.float32)

# Sobel kernels
SOBEL_X = np.array([[ -1,  0,  1],
                    [ -2,  0,  2],
                    [ -1,  0,  1]], dtype=np.float32)

SOBEL_Y = np.array([[  1,  2,  1],
                    [  0,  0,  0],
                    [ -1, -2, -1]], dtype=np.float32)

# Prewitt kernels
PREWITT_X = np.array([[ -1,  0,  1],
                      [ -1,  0,  1],
                      [ -1,  0,  1]], dtype=np.float32)

PREWITT_Y = np.array([[  1,  1,  1],
                      [  0,  0,  0],
                      [ -1, -1, -1]], dtype=np.float32)

# Sobel 
def sobel_edge_detection(image):
    gray = to_grayscale(image)
    gx = convolve(gray, SOBEL_X)
    gy = convolve(gray, SOBEL_Y)
    magnitude = np.hypot(gx, gy)
    return np.clip(magnitude, 0, 255).astype(np.uint8)

# Prewitt 
def prewitt_edge_detection(image):
    gray = to_grayscale(image)
    gx = convolve(gray, PREWITT_X)
    gy = convolve(gray, PREWITT_Y)
    magnitude = np.hypot(gx, gy)
    return np.clip(magnitude, 0, 255).astype(np.uint8)

# Canny 
def canny_edge_detection(image, low_thresh=50, high_thresh=100):
    gray = to_grayscale(image)

    # Step 1: Gaussian Blur (3x3 kernel)
    kernel = np.array([[1, 2, 1],
                       [2, 4, 2],
                       [1, 2, 1]], dtype=np.float32) / 16
    blurred = convolve(gray, kernel)

    # Step 2: Gradient (using Sobel)
    gx = convolve(blurred, SOBEL_X)
    gy = convolve(blurred, SOBEL_Y)
    magnitude = np.hypot(gx, gy)

    # Step 3: Thresholding (approximate)
    result = np.zeros_like(magnitude, dtype=np.uint8)
    result[magnitude >= high_thresh] = 255
    result[(magnitude >= low_thresh) & (magnitude < high_thresh)] = 75
    return result