# Volume Hand Gesture Controller

This Python program allows the user to control the volume of their computer device with a hand gesture in real time. The user can pinch closer together their thumb and index finger to lower their volume, and bring them further apart to raise the volume. The volume control is only activated if the rest of the hand is folded (i.e. the fingers are bent in). This prevents the volume from accidentally being set to another level. The program calculates the user's hand proportions and uses these to assign a minimum and maximum distance to control the volume. This means the program can function regardless of how far away the hand is, the size of the user's hand, or their age.
The computer vision library 'OpenCV' is used to work with the frames and deal with the rendering of it. It is also used to help access the device's webcam to input a video stream in real time. The entirety of the script is written in Python. 

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the required modules and dependencies. 

```bash
pip install opencv-python #computer vision and rendering
pip install mediapipe #hand landmarks detection
pip install ctypes #volume control
pip install comtypes #volume setting configuration
pip install pycaw #volume control
```

## Usage
Using the software is very simple. 
- Run the program. After a few seconds, you should see a video stream from the webcam of yourself. If enabled and your hand's in view, you will also see the markings and construction lines around your hand too. 
- A line between the tips of your thumb and index finger will show to visually show you how far apart they are.
- ACTIVATE volume control: fold in other 3 fingers. You will see a volume bar appear and you can adjust the volume by moving your thumb and index finger closer (lower volume) or further (raise volume).
- DEACTIVATE volume control: open out other 3 fingers. The volume bar will be hidden and you will not be able to change the volume. 

## How it works
1. Connection is made to your device's speakers. 
2. Control variables and prerequistes are identified and set.
3. Connection is made to your device's webcam and a video stream starts.
4. The current frame is extracted and read.
5. The hand detection algorithm processes the frame and returns a list of landmarks and positions.
6. These are loaded as dots onto the frame and the relevant connecting lines are drawn.
7. Each finger has 4 landmarks and the angles between the connecting lines are calculated to tell for each finger whether it is straight or bent.
8. If pinky, ring, and middle finger are bent in (hand folded), palm measurements are matched with co-efficients to determine the distances representing the minimum and maximum volumes.
9. The actual distance between the thumb and pinky finger is calculated and is expressed as a percentage of volume. 
10. Python cannot directly set a speaker's volume using just a percentage as speakers are numerically set by a non-linear scale from -63.5 (0%) to 0 (100%). Using my maths skills and trial and error, I have created and hard coded a piecewise function which maps a percentage value onto a number on the appropiate scale.
11. This number is used to set the speaker's volume at the desired level. This percentage is rendered by filling the box.
12. The frame is rendered back, and the process repeats for next frame. If an exit command is received, the loop is broken and the program terminates.