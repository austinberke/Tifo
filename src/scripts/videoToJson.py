import moviepy.editor as mp
import os
import cv2
from PIL import Image
import json
import re
import sys

originalVideoFile = "/Users/alihashemi/Desktop/video.mp4"
resizedVideoFile = "/Users/alihashemi/Desktop/resized.mp4"
framesDirectory = "/Users/alihashemi/Desktop/frames"
jsonOutputFile = "/Users/alihashemi/Desktop/json.json"
height = 36
width = 48

def main():
    resize(48, 36, originalVideoFile, resizedVideoFile)
    saveFrames(resizedVideoFile, framesDirectory)
    frames = generateList(width, height, framesDirectory)
    saveJson(jsonOutputFile, frames)

# Resize the video to the given dimensions and save
def resize(w, h, videoFile, resizedVideoFile):
    clip = mp.VideoFileClip(videoFile)
    clip_resized = clip.resize(newsize=(w, h))
    clip_resized.write_videofile(resizedVideoFile)
    print ("Finished Rezising the video")

# Save all the frames of a given video as png files into the given directory name
def saveFrames(videoFileName, framesDirectory):
    if not os.path.exists(framesDirectory):
        os.makedirs(framesDirectory)

    print ("Saving frames of video...")
    video = cv2.VideoCapture(videoFileName)
    didRead, frame = video.read()
    count = 0;
    didRead = True
    while (didRead):
        cv2.imwrite(framesDirectory + "/Frame{}.png".format(count), frame)
        didRead, frame = video.read()
        count+=1

# Go through a file containing all the frames and create a list in the following format
# list[row in frame][column in frame][frame number]
def generateList(w, h, framesDirectory):
    if not os.path.exists(framesDirectory):
        print ("Error: {} does not exist".format(framesDirectory))
        return

    # Initialize frames list
    frames = []
    for i in xrange(h):
        row = []
        for j in xrange(w):
            colors = []
            row.append(colors)
        frames.append(row)

    print ("Generating list of pixel colors...")
    for fil in sort(os.listdir(framesDirectory)):
        if fil.endswith(".png"):
            with Image.open(framesDirectory + "/" + fil) as pixelsOfFrame:
                w, h = pixelsOfFrame.size
                obj = pixelsOfFrame.getdata()
                for pixelNumeber, color in enumerate(obj):
                    row = pixelNumeber/w
                    col = pixelNumeber%w
                    hexColor = rgbToHex(color)
                    frames[row][col].append(hexColor)
    return frames

# Writes data to json file
def saveJson(fileName, data):
    with open(fileName, 'w') as outfile:
        json.dump(data, outfile)
    print ("Saved pixel color data to {}".format(fileName))

# Converts a tupil (R, G, B) to a hex code
def rgbToHex(rgb):
    return '#%02x%02x%02x' % rgb

# Sort files in ascending order
def sort(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(data, key=alphanum_key)

if __name__ == '__main__':
    main()
