---
title: "Indoor Acoustic Localization: Achieving 100% Accuracy"
excerpt: "100% indoor acoustic localization accuracy across 16 areas solely with on-phone sensors<br/><img src='/images/project/acoustic_localization/teaser2.png' width='600'>"
collection: portfolio
---

## Project Overview
We developed an innovative indoor acoustic localization system using only on-phone sensors, achieving 100% accuracy across 16 distinct areas within a building. This project demonstrates the potential of acoustic-based positioning in GPS-denied environments.

## Key Technologies
- **Chirp Signal Processing**: Emitting 12-13kHz chirps (10ms duration), and receiving echo
- **Cross-correlation**: For precise echo detection and isolation
- **Spectrogram Analysis**: Converting acoustic data into visual representations
- **Convolutional Neural Networks (CNN)**: For area classification based on gray-scaled spectrograms
- **Spectral Contrast Enhancement**: Our novel technique for improving signal distinctiveness
- **k-Nearest Neighbor (kNN)**: Supplementary algorithm using Wi-Fi RSS for east-west disambiguation of symmetrical areas

## Development Process

1. **Prototype Creation**
   - Implemented chirp signal generation and reception
   - Developed cross-correlation for echo isolation
   - Created real-time spectrogram visualization

2. **Data Collection**
   - Built an automated data collection app
   - Gathered ~1600 samples (100 per area) across 16 locations

3. **Model Training**
   - Designed and trained a CNN for spectrogram classification

4. **Accuracy Improvement**
   - Introduced **Spectral Contrast** technique to enhance unique signal features
   - Implemented kNN with Wi-Fi RSS to resolve symmetrical area ambiguities

5. **Final Evaluation**
   - Achieved 100% localization accuracy in real-world testing

## Innovation: Spectral Contrast
Our key contribution, Spectral Contrast, improved localization accuracy by enhancing distinct signal features while attenuating common ones. This technique proved crucial in differentiating areas with similar spatial structures. Moreover, it also contributed to the reduction of training data required for the CNN.

## Future Work
[Prof. Marco Zúñiga](https://www.st.ewi.tudelft.nl/marco/team.html) has proposed extending this research into a paper, focusing on the benefits of the Spectral Contrast technique in acoustic localization.

## Detailed Reports
For in-depth technical information and project progression, please refer to our series of reports:
- [Initial Prototype (Report 1)](http://tonyyunyang.github.io/images/project/acoustic_localization/report1.pdf)
- [Data Collection and Model Training (Report 2)](http://tonyyunyang.github.io/images/project/acoustic_localization/report2.pdf)
- [Final System and Evaluation (Final Report)](http://tonyyunyang.github.io/images/project/acoustic_localization/report3.pdf)