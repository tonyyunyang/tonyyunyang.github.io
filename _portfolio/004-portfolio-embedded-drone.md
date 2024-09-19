---
title: "Embedded Quadcopter Control System: Multi-Mode Flight Control"
excerpt: "Developed a scalable, real-time evacuation planning system for global flood scenarios using big data technologies<br/><img src='/images/project/embedded_drone/teaser.png' width='600'>"
collection: portfolio
---

## Project Overview

We developed a comprehensive embedded control system for a tethered electrical model quadcopter, implementing multiple flight modes and achieving stable flight control. The project demonstrates the application of embedded systems in UAV technology, utilizing custom PCB, sensor modules, and motor controllers.

## Key Technologies

- **Rust Programming**: For efficient and safe embedded software development
- **Custom Communication Protocol**: For reliable data exchange between host and device
- **State Machine**: For managing different operational modes
- **PID Control**: For stabilizing quadcopter flight in various modes
- **Sensor Fusion**: Implementing Kalman filter for orientation estimation
- **Real-time Data Logging**: For performance analysis and debugging
- **Terminal User Interface (TUI)**: For user-friendly control and monitoring

## Development Process

1. **System Architecture Design**
   - Designed communication protocol for host-device interaction
   - Developed state machine for managing operational modes
   - Implemented user input handling for joystick and keyboard

2. **Flight Control Implementation**
   - Created manual mode for direct motor control
   - Developed calibration mode for sensor offset calculation
   - Implemented yaw control mode with proportional control
   - Designed full control mode with cascaded control loops
   - Developed raw mode using Kalman filter for sensor fusion
   - Implemented height control mode with PID controller

3. **Data Management and Visualization**
   - Implemented real-time data logging system
   - Developed Terminal User Interface (TUI) for system monitoring

4. **Testing and Optimization**
   - Conducted performance analysis of communication systems
   - Evaluated control loop iteration times for different modes
   - Compared custom Kalman filter with built-in DMP for orientation estimation

## Innovation: Multi-Mode Control System

Our key contribution is the development of a versatile control system supporting multiple flight modes, each tailored for specific operational requirements. This approach allows for flexible quadcopter operation and facilitates both testing and real-world applications.

## Future Work

Potential areas for improvement and expansion include:
- Implementing more efficient data storage management for logging
- Exploring advanced filtering techniques like the Madgwick filter
- Integrating camera functionality for enhanced control and features

## Video Showcase

Here's a demonstration of me testing the drone's control system.

<video width="100%" controls>
  <source src="/images/project/embedded_drone/12cbcfd4-3e24-40ca-a39e-563229675c91.MP4" type="video/mp4">
  Your browser does not support the video tag.
</video>
