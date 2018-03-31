import moviepy.editor as mp
import os
import cv2

originalVideoFile = "/Users/alihashemi/Desktop/video.mp4"
resizedVideoFile = "/Users/alihashemi/Desktop/resized.mp4"
framesDirectory = "/Users/alihashemi/Desktop/frames"

def main():
    #resize(48, 36, originalVideoFile, resizedVideoFile)
    saveFrames(resizedVideoFile, framesDirectory)

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


if __name__ == '__main__':
    main()
