import cv2
from tkinter import Tk, Toplevel, Label
from PIL import Image, ImageTk

class WebcamViewer:
    def __init__(self, root, cam_index, default_width=640, default_height=480):
        self.cam_index = cam_index
        self.default_width = default_width
        self.default_height = default_height
        
        # Initialize video capture
        self.capture = cv2.VideoCapture(cam_index)
        
        # Create a Toplevel window and set its size
        self.window = Toplevel(root)
        self.window.title(f"Webcam {cam_index}")
        self.window.geometry(f"{default_width}x{default_height}")  # Set default size
        
        # Label to show the video feed
        self.label = Label(self.window)
        self.label.pack(fill='both', expand=True)
        
        # Bind the resize event to update the frame size
        self.window.bind('<Configure>', self.on_resize)

        # Start updating frames
        self.update_frame()

    def on_resize(self, event):
        self.update_frame()

    def update_frame(self):
        ret, frame = self.capture.read()
        if ret:
            # Resize the frame to fit the label size
            width, height = self.label.winfo_width(), self.label.winfo_height()
            frame = cv2.resize(frame, (width, height))

            # Convert color from BGR to RGB
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Convert to ImageTk format
            img = Image.fromarray(frame)
            imgtk = ImageTk.PhotoImage(image=img)
            self.label.imgtk = imgtk
            self.label.configure(image=imgtk)
        
        # Update every 30 milliseconds instead of 10
        self.window.after(30, self.update_frame)

def get_available_cameras():
    available_cameras = []
    for i in range(2):  # Check up to 10 cameras
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            available_cameras.append(i)
        cap.release()
    return available_cameras

def main():
    root = Tk()
    root.title("Main Window")
    root.withdraw()  # Hide the main Tk window

    camera_indices = get_available_cameras()
    viewers = [WebcamViewer(root, i) for i in camera_indices]

    root.mainloop()  # Start the Tkinter event loop

if __name__ == "__main__":
    main()
