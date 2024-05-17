# face-api-client-kyc

This project explores the use of face-api.js for liveness detection in KYC (Know Your Customer) processes, running directly on the client-side to reduce server costs.

## Project Goals

- **Reduce KYC Verification Failure Rates:** Improve the accuracy of initial KYC verification by using face liveness detection to identify real faces, reducing the number of failed attempts due to blurry images, incorrect angles, or spoofing attempts.
- **Minimize Server Costs:** Shift initial AI detection to the client-side using face-api.js, reducing the load on the server and potentially lowering infrastructure costs.

## Technologies Used

- **Next.js 14:** Framework for building React applications with server-side rendering and other performance optimizations.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **DaisyUI:** Component library built on top of Tailwind CSS for common UI elements.
- **face-api.js:** JavaScript API for face detection and recognition running entirely in the browser.

## Project Features

- **Liveness Detection:**
  - Detects random instructions like mouth opening, blinking, and nodding.
  - Provides visual feedback to the user with a flashing alert and step-by-step instructions.
  - Verifies liveness if all instructions are completed successfully.
- **Client-Side AI:**
  - Runs face detection and liveness checks directly in the browser using face-api.js.
  - Reduces the need for server-side processing, lowering server load and costs.
- **Loading State:** Displays a loading indicator while models and video/canvas elements are being loaded.
- **Camera Permission Handling:** Prompts the user for camera access and displays appropriate messages based on permission status.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rizqipratamar/face-api-client-kyc.git
   cd face-api-client-kyc
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Download face-api.js models:**

   - Download the necessary face-api.js models (tiny_face_detector, face_landmark_68) from the official repository: [https://github.com/justadudewhohacks/face-api.js/tree/master/weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - Place the models in the `public/models` directory of your project.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open the app in your browser:**
   ```
   http://localhost:3000
   ```

## Future Improvements

- **Enhanced Accuracy:** Explore more advanced liveness detection techniques, potentially using 3D depth information or heart rate detection.
- **Integration with KYC Backend:** Connect the client-side liveness check to a backend KYC system for further verification and processing.
- **User Experience:** Improve the user interface and provide more intuitive guidance during the liveness check process.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.
