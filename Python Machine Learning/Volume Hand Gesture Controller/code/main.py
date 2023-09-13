import cv2
import mediapipe as mp
import time
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
import math
import numpy as np
import pyautogui as pc

devices = AudioUtilities.GetSpeakers()
interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
volume = cast(interface, POINTER(IAudioEndpointVolume))
#3 lines above were taken from a StackOverflow post as they managed to solve the problem

def scaleConverter(percentVolume, defaultOffset=0.4):
    if percentVolume <= 0:
        return -63.5
    if percentVolume >= 100:
        return 0.0
    if percentVolume <= 1.6:
        return max(round(((0.75*(percentVolume**2))+(3.75*(percentVolume))-63.5), 2) + defaultOffset, -63.5)
    elif percentVolume >= 92.0:
        return min(round(((percentVolume-100)/6),2) + defaultOffset, 0)
    else:
        return round((34.8*math.log(0.25*(percentVolume+0.9), 10))-48.9, 2) + defaultOffset
def setVolume(newVolume):
    scaled = scaleConverter(newVolume)
    volume.SetMasterVolumeLevel(scaled, None) 
def pxtoPercent(landmarks, lineLength, minLmSet=[1, 2], maxLmSet=[0, 17], minCoefficient=0.5, maxCoefficient=1.3):
    #min
    minStart = landmarks[minLmSet[0]]
    minEnd = landmarks[minLmSet[1]]
    minLength = round((minCoefficient*(((minEnd[0]-minStart[0])**2)+((minEnd[1]-minStart[1])**2))**0.5), 1)
    #max
    maxStart = landmarks[maxLmSet[0]]
    maxEnd = landmarks[maxLmSet[1]]
    maxLength = round((maxCoefficient*(((maxEnd[0]-maxStart[0])**2)+((maxEnd[1]-maxStart[1])**2))**0.5), 1)
    
    #calculate %
    if lineLength < minLength:
        lineLength = minLength
    if lineLength > maxLength:
        lineLength = maxLength
    
    percentageValue = round(((lineLength-minLength)/(maxLength-minLength))*100, 1)
    
    
    return minLength, maxLength, percentageValue
def fingerLengthCalc(landmarks):
    fingerLengths = []
    for finger in fingerArray:
        fingerName = finger[1]
        fingerPointsArr = finger[2]
        totalLength = 0
        for i in range(4):
            currentID = fingerPointsArr[i]
            currentPoint = landmarks[currentID]
            if i == 0:
                prevPoint = currentPoint
            newLength = round((((currentPoint[0]-prevPoint[0])**2)+((currentPoint[1]-prevPoint[1])**2))**0.5, 1)
            totalLength += newLength
            prevPoint = currentPoint
        fingerLengths.append(totalLength)
    return fingerLengths  
def getInDegrees(radians):
    return radians * (180/math.pi)
def eDistance(pointA, pointB):
    return round((((pointB[0]-pointA[0])**2)+((pointB[1]-pointA[1])**2))**0.5, 1)
def fingerAngleCalc(landmarks, baseID, threshFingers=0.4, threshThumb=0.8):
    basePoint = landmarks[baseID]
    midPoint = landmarks[baseID + 1]
    endPoint = landmarks[baseID + 2]
    d1 = eDistance(basePoint, midPoint)
    d2 = eDistance(midPoint, endPoint)
    d3 = eDistance(basePoint, endPoint)
    #cv2.circle(img, midPoint, 10, (0, 255, 0), 2)
    #cv2.line(img, basePoint, endPoint, (0, 255, 0), 2)
    
    if d1 == 0:
        d1 = 0.1
    if d2 == 0:
        d2 = 0.1
        
    bendValue = -1 * ((d1**2)+(d2**2)-(d3**2))/(2*d1*d2)
    fingerState = "OPEN"
    
    if baseID >= 5:
        #finger
        if bendValue <= threshFingers:
            fingerState = "FOLDED"
    else:
        if bendValue <= threshThumb:
            fingerState = "FOLDED"
    
    return round(bendValue, 4), fingerState 

cap = cv2.VideoCapture(0)

mpHands = mp.solutions.hands
hands = mpHands.Hands()
mpDraw = mp.solutions.drawing_utils

handFolded = True
handFoldReq = [2, 3, 4]
fingerArray = [
    [4, "Thumb", [1, 2, 3, 4]],
    [8, "Index", [5, 6, 7, 8]],
    [12, "Middle", [9, 10, 11, 12]],
    [16, "Ring", [13, 14, 15, 16]],
    [20, "Pinky", [17, 18, 19, 20]]
]
fingerDisplayOffset = (-30, -20)
controlSettings = {
    "showHands": True,
    "volumeControlOn": True,
    "displayFingers": True,
    "displayOverallHand": True,
    "mouseControl": False
}

points = []

while True:
    success, img = cap.read()
    if not success:
        break
    img = cv2.flip(img, 1)
    imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(imgRGB)

    keyLandmarks = []
    interestIDs = [4, 8]
    if controlSettings["mouseControl"]:
        aspectRatio = 16/9
        virtualScreenWidth = 400
        virtualScreenHeight = int(round(virtualScreenWidth/aspectRatio))
        screenWidth, screenHeight = pc.size()
        windowWidth, windowHeight = img.shape[1], img.shape[0]
        topLeft = (int((windowWidth/2)-(virtualScreenWidth/2)), int((windowHeight/2)-(virtualScreenHeight/2)))
        btmRight = (int((windowWidth/2)+(virtualScreenWidth/2)), int((windowHeight/2)+(virtualScreenHeight/2)))
    
        cv2.rectangle(img, topLeft, btmRight, (0, 255, 0), 2)
        
    if results.multi_hand_landmarks:
        for handLms in results.multi_hand_landmarks:
            landmarks = []
            for id, lm in enumerate(handLms.landmark):
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                if id in interestIDs:
                    keyLandmarks.append((cx, cy))
                if controlSettings["showHands"]:                 
                    cv2.circle(img, (cx, cy), 8, (255, 0, 0), cv2.FILLED)
                    #pass
                landmarks.append((cx, cy))
            if controlSettings["showHands"]:    
                mpDraw.draw_landmarks(img, handLms, mpHands.HAND_CONNECTIONS) 
                #pass
            if controlSettings["displayFingers"]:
                #fingerLengths = fingerLengthCalc(landmarks)
                '''
                for i in range(5):
                    finger = fingerArray[i]
                    tipCentre = landmarks[finger[0]]
                    fingerName = finger[1]
                    
                    cv2.putText(img, fingerName, (tipCentre[0] + fingerDisplayOffset[0], tipCentre[1] + fingerDisplayOffset[1]), cv2.FONT_HERSHEY_COMPLEX_SMALL, 0.8, (255, 0, 255), 2)
                '''
                fingerColor = (255, 0, 0)
                fingerStates = []
                for i in range(5):
                    if i != 0:
                        bendValue, fingerState = fingerAngleCalc(landmarks, fingerArray[i][2][0])
                    else:
                        bendValue, fingerState = fingerAngleCalc(landmarks, 2)
                    fingerStates.append(fingerState)
                    txt = "{}: {}".format(fingerArray[i][1], fingerState)
                    sY = 350
                    cv2.putText(img, txt, (10, sY + (30*i)), cv2.FONT_HERSHEY_COMPLEX_SMALL, 0.8, fingerColor, 1) 
                if controlSettings["displayOverallHand"]:
                    handFolded = True
                    for id in handFoldReq:
                        if fingerStates[id] == "OPEN":
                            handFolded = False
                            break
                    if handFolded:
                        text = "HAND FOLDED"
                    else:
                        text = "HAND OPEN"
                    cv2.putText(img, text, (10, 30), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, fingerColor, 2)
            
            if (controlSettings["mouseControl"]):
                
                
                controlPoint = landmarks[8]
                
                cv2.circle(img, controlPoint, 5, (255, 0, 255), -1)
                
                propX = (controlPoint[0] - topLeft[0])/(btmRight[0] - topLeft[0])
                propY = (controlPoint[1] - topLeft[1])/(btmRight[1] - topLeft[1])
                
                newX = round(screenWidth*propX)
                newY = round(screenHeight*propY)
                
                pc.moveTo(newX, newY)
                
                if not handFolded:
                    pc.mouseDown()
                else:
                    pc.mouseUp()   
        
        if (controlSettings["volumeControlOn"] and handFolded and (fingerStates[1]=="OPEN")):  
            startPoint = keyLandmarks[0]
            endPoint = keyLandmarks[1]
            cv2.line(img, startPoint, endPoint, (255, 0, 255), 6)
            
            textColor = (255, 0, 0)
            boxHeight = 200
            boxWidth = 40
            topLeftCorner = (10, 90)
            lineLength = round((((endPoint[0]-startPoint[0])**2)+((endPoint[1]-startPoint[1])**2))**0.5, 1)
            
            #cv2.putText(img, "Length: "+str(lineLength), (10, 30), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 0, 0), 2)
            minLength, maxLength, percentageValue = pxtoPercent(landmarks, lineLength)
            setVolume(percentageValue)
            #cv2.putText(img, "Minimum Length: "+str(minLength), (10, 60), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 0, 0), 2)
            #cv2.putText(img, "Maximum Length: "+str(maxLength), (10, 90), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 0, 0), 2)
            cv2.putText(img, "Volume %: "+str(percentageValue), (10, 60), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, textColor, 2)  
            
            cv2.rectangle(img, topLeftCorner, (topLeftCorner[0]+boxWidth, topLeftCorner[1]+boxHeight), textColor, 2)
            cv2.rectangle(img, (topLeftCorner[0], int(topLeftCorner[1] + round(((100-percentageValue)/100)*boxHeight, 1))),(topLeftCorner[0]+boxWidth, topLeftCorner[1]+boxHeight), textColor, -1)
 
    cv2.imshow("Image", img)
    if cv2.waitKey(25) & 0xFF == ord('q'):
        break
cap.release()
