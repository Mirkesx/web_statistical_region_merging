import os
import sys
import cv2


if __name__ == '__main__':
    filename = sys.argv[1]
    # print(filename)

    original_name = "./public/uploads/original_{}.png".format(filename.split('.')[0])

    try:
        os.remove(original_name)
        print("Files deleted.")
    except:
        print("Files don't exist.")

    print("Retrieving the image")
    raw = cv2.imread("./public/uploads/{}".format(filename))
    cv2.imwrite(original_name, raw)