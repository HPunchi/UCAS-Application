import numpy as np 
import cv2
import matplotlib.pyplot as plt
import imutils
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def displayScreens(feed):
    for image in feed:
        cv2.imshow("Image Output", image)
        cv2.waitKey(0)
    cv2.destroyAllWindows()
    
    
source = "sample1.jpeg"

img = cv2.imread(source)

grayscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

gray = cv2.bilateralFilter(grayscale, 13, 15, 15)

edged = cv2.Canny(gray, 30, 200)


contours = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours = imutils.grab_contours(contours)
contours = sorted(contours, key=cv2.contourArea, reverse = True)[:10]
screenCnt = None
d = False
draw = img.copy()

for c in contours: 
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.018 * peri, True)
    if len(approx) == 4:
        screenCnt = approx
        d = True
        break
    
if d == False:
    detected = 0
    print("No detection.")
else:
    detected = 1

if detected == 1:
    cv2.drawContours(draw, [screenCnt], -1, (0, 0, 255), 3)

mask = np.zeros(gray.shape, np.uint8)
new_image = cv2.drawContours(mask, [screenCnt], 0, 255, -1)
new_image = cv2.bitwise_and(draw, draw, mask=mask)

(x, y) = np.where(mask == 255)
(topx, topy) = (np.min(x), np.min(y))
(bottomx, bottomy) = (np.max(x), np.max(y))
cropped = gray[topx:bottomx+1, topy:bottomy+1]
cropped = cv2.resize(cropped, (0, 0), fx=3, fy=3)
offset = 5

text = pytesseract.image_to_string(cropped, config='--psm 10')
#text = pytesseract.image_to_string(cropped)
#draw = cv2.putText(draw, str(text), (topx + offset, topy + offset), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 5)

print("-------------------------------------------------------------------")
print("Registration Plate Recognition:\n")
print("Detection: ", text)
print("-------------------------------------------------------------------")



feed = [img, grayscale, gray, edged, draw, cropped]
displayScreens(feed)





