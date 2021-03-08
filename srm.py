import numpy as np
import os
import sys
import cv2
import math
import random

class srm:
    def __inti__():
        self.image=None
        self.parent=None
        self.shape=None
        self.Q = None
        self.G = None
        # probality that a region can be merged 
        self.delta = None
        self.size=None
        self.min_size = None
        self.max_regions = None
        

    def run(self, image , Q=32, max_regions=15, min_size=0.001):

        self.shape = image.shape
        (h,w,c) = self.shape
        self.size = w*h
        self.image = np.float32(image.reshape(self.size, -1))
        self.parent = np.arange(self.size)
        self.rank = np.ones(self.size)
        self.Q = Q
        self.G = 256
        self.max_regions = max_regions if max_regions > 0 else self.size
        #print(self.max_regions)
        self.min_size = min_size*self.size
        self.delta = math.log(6)+2*math.log(self.size)

        edge_list = self.make_edge_pairs_list()

        for ptA , ptB in edge_list[0:]:
            parentA = self.get_parent(ptA)
            parentB = self.get_parent(ptB)
            if parentA != parentB and self.predicate(parentA,parentB):
                self.merge(parentA, parentB)

        if self.max_regions > 0:
            self.merge_occlusions()

        if self.min_size > 0:
            self.merge_smaller_regions()

        for i in range(self.size):
            color = self.image[self.get_parent(i)]
            self.image[i]= color

        #print(np.unique(self.rank))
        return self.image.reshape(self.shape[0], self.shape[1], -1)

    def make_edge_pairs_list(self):
        (h,w,c) = self.shape
        pairs = []

        for i in range(0,h):
            for j in range(0,w):
                index = i*w+j 
                if i != h-1:
                    pairs.append((index, index+w))
                if j != w-1:
                    pairs.append((index, index+1))

        return self.sort_edge_pairs(pairs)

    def sort_edge_pairs(self,pairs):
        img = self.image
        # print(img.shape)
        def diff(p):
            (r1, r2) = p
            diff = np.max(np.abs(img[r1] - img[r2]))
            return diff
        return sorted(pairs, key=diff)

    def evaluate_predicate(self,ptA):
        return (self.G**2/float(2*self.Q*self.rank[ptA]))*(min(self.G,self.rank[ptA])*math.log(self.rank[ptA]+1)+self.delta)

    def predicate(self,ptA, ptB):
        predicate_A = self.evaluate_predicate(ptA)
        predicate_B = self.evaluate_predicate(ptB)
        comp = (self.image[ptA] - self.image[ptB] )**2
        return (comp <= (predicate_A+predicate_B)).all()

    def merge(self,ptA,ptB):
        s1 = self.rank[ptA]
        s2 = self.rank[ptB]
        color = (self.image[ptA]*s1+self.image[ptB]*s2)/float(s1+s2)

        if  s1 < s2:
            ptA, ptB = ptB, ptA

        self.parent[ptB] = ptA
        self.rank[ptA] += self.rank[ptB]
        self.image[ptA] = color

    def get_parent(self,ptA):
        if self.parent[ptA] == ptA:
            return ptA
        p = self.get_parent(self.parent[ptA])
        # lazy propogation
        self.parent[ptA] = p
        return p

    def merge_occlusions(self):
        for i in range(1,self.size):
            r1 = self.get_parent(i)
            r2 = self.get_parent(i-1)
            if r1 != r2 and self.rank[r1] <= self.min_size:#+self.rank[r2] <= self.min_size:
                self.merge(r1, r2)

    def merge_smaller_regions(self):
        max_parents = self.retrieve_max_parents()
        if len(max_parents) > self.max_regions:
            allowed_parents = max_parents[:self.max_regions]
            for i in range(1, self.size):
                r1 = self.get_parent(i)
                r2 = self.get_parent(i-1)
                if r1 != r2 and r1 not in allowed_parents:
                    self.merge(r1, r2)

    def retrieve_max_parents(self):
        unique, counts = np.unique(self.parent, return_counts=True)
        parents_counts = dict(zip(unique, counts))
        return [k for k, v in sorted(parents_counts.items(), key=lambda item: item[1], reverse=True)]



#METHODS FOR MORPHOLOGIC OPERATIONS

def hex2rgb(color):
    r = color[1:3]
    g = color[3:5]
    b = color[5:7]
    return int(r, 16), int(g, 16), int(b, 16)

def apply_borders(im1, im2, color="#00ffff"):
    w = im1.shape[0]
    h = im1.shape[1]
    r, g, b = hex2rgb(color)
    # print(r,g,b)
    im3 = im1.copy()
    for i in range(w):
        for j in range(h):
            if im2[i][j].any() != 0:
                im3[i][j][0] = b
                im3[i][j][1] = g
                im3[i][j][2] = r
    return im3

def find_borders(img, dim1=5, dim2=5):
    k1 = np.ones((dim1,dim1), np.uint8)
    k2 = np.ones((dim2,dim2), np.uint8)
    dilation = cv2.dilate(img, k1, iterations=1)
    erosion = cv2.erode(img, k2, iterations=1)
    return dilation - erosion


if __name__ == '__main__':
    filename = sys.argv[1]
    q = int(sys.argv[2])
    k1 = int(sys.argv[3])
    k2 = int(sys.argv[4])
    color = sys.argv[5]
    max_regions = int(sys.argv[6])
    min_size = float(sys.argv[7])
    # print(filename)
    # print(q)
    # print(k1)
    # print(k2)
    # print(color)

    if min_size > 1:
        min_size = 1
    elif min_size < 0:
        min_size = 0
    #print(min_size)

    original_name = "./public/uploads/original_{}.png".format(filename.split('.')[0])
    segmented_name = "./public/uploads/segmented_{}.png".format(filename.split('.')[0])
    borders_name = "./public/uploads/borders_{}.png".format(filename.split('.')[0])
    seg_borders_name = "./public/uploads/seg_borders_{}.png".format(filename.split('.')[0])

    try:
        os.remove(original_name)
        os.remove(segmented_name)
        os.remove(borders_name)
        os.remove(seg_borders_name)
        print("Files deleted.")
    except:
        print("Files don't exist.")

    print("Retrieving the image")
    raw = cv2.imread("./public/uploads/{}".format(filename))
    cv2.imwrite(original_name, raw)
    srm_algo = srm()
    #print(raw.shape)
    segmented = srm_algo.run(raw,q, max_regions, min_size)
    #print(segmented.shape)
    print("Storing the segmented images")
    cv2.imwrite(segmented_name, segmented)

    print("Capturing borders from the segmented image")
    borders = find_borders(segmented, k1, k2)
    cv2.imwrite(borders_name, borders)

    print("Displaying borders in the original picture")
    image_borders = apply_borders(raw, borders, color)
    cv2.imwrite(seg_borders_name, image_borders)