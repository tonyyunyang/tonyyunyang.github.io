---
title: "Indoor Acoustic Localization"
excerpt: "100% indoor acoustic localization accuracy across 16 areas solely with on-phone sensors<br/><img src='/images/project/acoustic_localization/teaser2.png' width='600'>"
collection: portfolio
---

This is a project built from scratch on indoor acoustic localization using on-phone sensors. We achieved 100% localization accuracy during the final evaluation across 16 areas in a building solely based on on-phone sensors.

We first developed a prototype that could emit a chirp signal, receive the echo, crop the the echo out from the received signal with cross-correlation, and at last plot the gray-scaled spectrogram on the screen. During this process, we also decided to use a chirp signal varying from 12kHz to 13kHz with 10ms duration.

Then we developed an app that could automatically collect data as the user moves around. Approximately 100 samples were collected for each area, resulting in 1600 samples among 16 areas in total.

After that an app with the model deployed was developed for testing. However, due to the similarity of spatial structures across some areas, the accuracy was not satisfactory. We came up with the idea of **Spectral Contrast** to improve the localization accuracy. The idea is rather simple, it basically enhances the part of the signal that is significanly different from the rest, while attenuate the part that is similar.

During the evaluation in the end, we also employed a very simple **k-nearest neighbor** algorithm utilizing the Wi-Fi signals in the building, to distinguish **EAST** and **WEST** of the building, as the building has a symmetric structure.

[Prof. Marco Zúñiga](https://www.st.ewi.tudelft.nl/marco/team.html) proposed an opportunity to extend this work to a paper, exploring the benefits brought by the **Spectral Contrast** idea.

You can find more details in the three concise reports delivered throughout the project:
[Report 1](http://tonyyunyang.github.io/images/project/acoustic_localization/report1.pdf), [Report 2](http://tonyyunyang.github.io/images/project/acoustic_localization/report2.pdf), and [Final Report](http://tonyyunyang.github.io/images/project/acoustic_localization/report3.pdf)