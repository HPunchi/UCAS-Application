import cv2
import numpy as np
import os

def process(file):
    img = cv2.imread(file)
    
    cv2.imshow(file, img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

root = 'ANPR'
acceptedExtensions = [".jpeg", ".jpg", ".png"]
files = os.listdir(root)
for file in files:
    name, extension = os.path.splitext(file)
    if extension in acceptedExtensions:
        process(root + '\\' + file)
        
        
#program to iterate through images in directory and display them
