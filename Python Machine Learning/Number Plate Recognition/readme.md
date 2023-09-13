# Number Plate Recongition

This software runs in a singular Python script. The program is designed to capture an image stored in a local accessible directory and then uses computer vision through the library 'OpenCV' to identify the registration plate and further uses the 'PyTesseract' library which reads the text using an OCR (Optical Character Recognition) algorithm which utilises machine learning and datasets to a fair extent. 

A sample image is provided as default within the same folder as the script.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the Python dependencies needed. Not all of the below are required however are useful to have installed. 
[PyTesseract's executable](https://sourceforge.net/projects/tesseract-ocr-alt/?source=typ_redirect) is required to be installed and referenced in the program as demonstrated below.
```bash
pip install numpy #math operations and arrays
pip install opencv-python #vision tool to capture plate
pip install matplotlib #image rendering tool
pip install imutils #identifies image contours
pip install pytesseract #OCR to read the text 
```

## Usage
Before attempting to run the program:
1. Check that dependencies are in fact installed and are being correctly imported. The script show show no errors during the import process:
```python
import numpy as np 
import cv2
import matplotlib.pyplot as plt
import imutils
import pytesseract
```
2. Ensure the filepath for the pytesseract executable is valid and correct:
```python
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```
3. Ensure a valid filepath is provided for the image to be used in the number plate recognition. (The example below is set as default for the image provided in the folder)
```python
source = "sample1.jpeg"
```
The program should execute without errors. However, there is no guarantee that the program will output the correct number plate every time without fail. To maximise the chances of a correct recognition, here are some tips for choosing a source image:
- Distance: the vehicle should not be too close or too far from the camera. A few metres should work well.
- Orientation: the image must ideally taken from a straight viewpoint or at a very slight angle.
- Lighting: pictures taken in darkness or during night may have less chances of being correctly processed.
- Weather/obstructions: try to ensure the number plate is not obscured or blurred by anything (such as raindrops, snow, leaves, mud, etc.)

The default image provided is an perfect example of a correctly chosen image.

## Further Development
This program is highly effective and efficient at capturing number plates. A video file (perhaps from a CCTV camera covering a road or a car park) can be imported and read. A loop can be set up to analyse the video frame by frame, at each analysis the frame can be passed as input into this algorithm. Plates can be identified and stored in an array. This would work as an ANPR system for car parking lots, highways, urban areas, etc.





