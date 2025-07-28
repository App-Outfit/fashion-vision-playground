import requests
import time
import os

API_URL = "http://localhost:8000/api/v1"
USER_ID = "test_user"
HEADERS = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Indtc3UyNUhwUENLeVZxbVQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3JudXdidXRzeHl0dW5ma3BoZG56LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwNjYzZmZmMS04OGE1LTQ1YTctOGFmYy1mYzg1NzgyMDY4ZDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzUzNzIwNTk4LCJpYXQiOjE3NTM3MTY5OTgsImVtYWlsIjoidGhlb2JvbnppLnByb0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoidGhlb2JvbnppLnByb0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwNjYzZmZmMS04OGE1LTQ1YTctOGFmYy1mYzg1NzgyMDY4ZDAifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1MzcxNjk5OH1dLCJzZXNzaW9uX2lkIjoiYTE1ZDVjNGYtNGMwMy00MzAyLTgwYmUtMjk5ZDRkNmVlMmNjIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.hOy1f_ssxTGHkbPbJuDEnM3k7xx5sUiNs8Ks4kJtQC8"}

# Charger la liste des images garment.png
GARMENT_LIST_PATH = "/home/theob/Documents/wearit/fashion-vision-playground/garment_list.txt"
with open(GARMENT_LIST_PATH, "r") as f:
    IMAGE_PATHS = [line.strip() for line in f if line.strip()]

N = len(IMAGE_PATHS)
print(f"Benchmark sur {N} images garment.png\n")

def benchmark_cross_modal():
    times = []
    for i, img_path in enumerate(IMAGE_PATHS):
        files = {"image": open(img_path, "rb")}
        data = {"text": "jacket", "alpha": 0.5, "top_k": 6, "user_id": USER_ID}
        start = time.time()
        r = requests.post(f"{API_URL}/search/", files=files, data=data, headers=HEADERS)
        if r.status_code != 200:
            print(f"Error: {r.status_code} {r.text}")
            break
        elapsed = time.time() - start
        times.append(elapsed)
        if (i+1) % 50 == 0:
            print('.', end='', flush=True)
    print(f"\nCross-modal search: moyenne {sum(times)/N:.2f}s (min {min(times):.2f}s, max {max(times):.2f}s)")

def benchmark_multi_label():
    times = []
    for i, img_path in enumerate(IMAGE_PATHS):
        files = {"image": open(img_path, "rb")}
        data = {"labels": "jacket,coat,shirt", "user_id": USER_ID}
        start = time.time()
        r = requests.post(f"{API_URL}/classify/", files=files, data=data, headers=HEADERS)
        if r.status_code != 200:
            print(f"Error: {r.status_code} {r.text}")
            break
        elapsed = time.time() - start
        times.append(elapsed)
        if (i+1) % 50 == 0:
            print('.', end='', flush=True)
    print(f"\nMulti-label: moyenne {sum(times)/N:.2f}s (min {min(times):.2f}s, max {max(times):.2f}s)")

def benchmark_segmentation():
    times = []
    for i, img_path in enumerate(IMAGE_PATHS):
        files = {"image": open(img_path, "rb")}
        data = {"user_id": USER_ID}
        start = time.time()
        r = requests.post(f"{API_URL}/segment/", files=files, data=data, headers=HEADERS)
        if r.status_code != 200:
            print(f"Error: {r.status_code} {r.text}")
            break
        elapsed = time.time() - start
        times.append(elapsed)
        if (i+1) % 50 == 0:
            print('.', end='', flush=True)
    print(f"\nSegmentation: moyenne {sum(times)/N:.2f}s (min {min(times):.2f}s, max {max(times):.2f}s)")

def benchmark_object_detection():
    times = []
    for i, img_path in enumerate(IMAGE_PATHS):
        files = {"image": open(img_path, "rb")}
        data = {"user_id": USER_ID}
        start = time.time()
        r = requests.post(f"{API_URL}/detect/", files=files, data=data, headers=HEADERS)
        if r.status_code != 200:
            print(f"Error: {r.status_code} {r.text}")
            break
        elapsed = time.time() - start
        times.append(elapsed)
        if (i+1) % 50 == 0:
            print('.', end='', flush=True)
    print(f"\nObject detection: moyenne {sum(times)/N:.2f}s (min {min(times):.2f}s, max {max(times):.2f}s)")

if __name__ == "__main__":
    print("--- BENCHMARK API (ALL GARMENT IMAGES) ---")
    benchmark_cross_modal()
    benchmark_multi_label()
    benchmark_segmentation()
    benchmark_object_detection() 