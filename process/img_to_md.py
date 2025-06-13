# from paddleocr import PaddleOCR

# ocr = PaddleOCR(lang="korean")
 
# img_path = "download_imgs/19.png"
# result = ocr.ocr(img_path, cls=False)
 
# ocr_result = result[0]

# for i in ocr_result:
#     print(i[1][0])

import base64
import io
# import cv2
import numpy as np
# from PIL import Image

# 이미지를 base64 변환
img_in = open('download_imgs/j743-1.png', 'rb')
base64_str = base64.b64encode(img_in.read())
imgdata = base64.b64decode(base64_str)
print(imgdata)

# base64를 이미지로 변환 
# img_out = Image.open(io.BytesIO(imgdata))
# img_out = np.array(img_out)
# img_out = cv2.cvtColor(img_out, cv2.COLOR_BGR2RGB)

# cv2.imwrite('./output.png', img_out)