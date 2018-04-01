from __future__ import print_function
import moviepy.editor as mp
import os
import cv2
from PIL import Image
import json
import re
import sys
import shutil

originalVideoFile = sys.argv[1]
height = int(sys.argv[2])
width = int(sys.argv[3])
resizedVideoFile = sys.path[0] + "/temp/resized.mp4"
framesDirectory = sys.path[0] + "/temp/frames"
jsonFile = sys.path[0] + "/../video.json"

def main():
    prep()
    resize(originalVideoFile)
    saveFrames(resizedVideoFile)
    frames = generateList()
    outputJson(frames)
    clean()

# Resize the video to the given dimensions and save
def resize(videoFile):
    print ("Starting resizing")
    clip = mp.VideoFileClip(videoFile)
    clip_resized = clip.resize(newsize=(width, height))
    clip_resized.write_videofile(resizedVideoFile)
    print ("Finished Rezising the video")

# Save all the frames of a given video as png files into the given directory name
def saveFrames(videoFileName):
    if not os.path.exists(framesDirectory):
        os.makedirs(framesDirectory)

    print ("Saving frames of video...")
    video = cv2.VideoCapture(videoFileName)
    didRead, frame = video.read()
    count = 0;
    didRead = True
    while (didRead):
        cv2.imwrite(framesDirectory + "/frame{}.png".format(count), frame)
        didRead, frame = video.read()
        count+=1

# Go through a file containing all the frames and create a list in the following format
# list[row in frame][column in frame][frame number]
def generateList():
    if not os.path.exists(framesDirectory):
        print ("Error: {} does not exist".format(framesDirectory))
        return

    # Initialize frames list
    frames = []
    for i in xrange(height):
        row = []
        for j in xrange(width):
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

# Writes data to stdout
def outputJson(data):
    #print (json.dumps(data))
    with open(jsonFile, 'w') as outfile:
        json.dump(data, outfile)

# Converts a tupil (R, G, B) to a hex code
def rgbToHex(rgb):
    return '#%02x%02x%02x' % rgb

# Sort files in ascending order
def sort(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(data, key=alphanum_key)

# Print to stderr
# def print(*args, **kwargs):
#     print(*args, file=sys.stderr, **kwargs)

# Creates temp files
def prep():
    if not os.path.exists(sys.path[0] + "/temp"):
        os.makedirs(sys.path[0] + "/temp")

# Removes temp files
def clean():
    shutil.rmtree(sys.path[0] + "/temp")

if __name__ == '__main__':
    main()
