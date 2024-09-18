---
title: "Self-Supervised Human Activity Recognition"
excerpt: "Improved accuracy in Human Activity Recognition using eye gaze data and self-supervised learning<br/><img src='/images/project/ra_mlm_har/cover.png' width='600'>"
collection: portfolio
---

# Self-Supervised Human Activity Recognition with Eye Gaze Data
## Project Overview
We developed an innovative approach to Human Activity Recognition (HAR) using eye gaze data and self-supervised learning techniques. Our method achieves improved accuracy and generalization across different activities and subjects, demonstrating the potential of eye movement patterns in understanding human behavior.

## Key Technologies
- **Masked Language Modeling (MLM)**: Adapted from NLP for time series data pretraining
- **Transformer Architecture**: Modified for processing multivariate time series data
- **Convolutional Neural Networks (CNN)**: For input projection and reconstruction
- **Cross-entropy Loss**: For fine-tuning classification tasks
- **Data Preprocessing**: Standardization and normalization of eye gaze data

## Development Process
1. **Model Architecture Design**
   - Adapted Transformer for time series data
   - Implemented MLM pretraining for eye gaze data
2. **Data Preparation**
   - Utilized DesktopActivity and ReadingActivity datasets
   - Applied sliding window approach with various sizes (30s, 60s)
3. **Model Training**
   - Conducted unsupervised MLM pretraining
   - Performed supervised fine-tuning for activity classification
4. **Performance Optimization**
   - Replaced linear layers with convolutional layers for improved reconstruction
   - Explored various hyperparameters and model configurations
5. **Evaluation**
   - Compared MLM-pretrained model against fully supervised baseline
   - Analyzed performance across different data availability scenarios

## Innovation: MLM Pretraining for Eye Gaze Data
Our key contribution is the adaptation of MLM pretraining for eye gaze time series data. This approach allows the model to learn generalizable features from unlabeled data, improving performance especially when labeled data is limited. The technique shows promise in capturing complex patterns in eye movements associated with different activities.

## Results
- MLM-pretrained model generally outperformed fully supervised model
- Improved performance with increased data from other subjects during fine-tuning
- Consistent performance gains across different window sizes and datasets

## Future Work
- Further investigation of reconstruction phenomena in MLM pretraining
- Optimization of model architecture for longer time sequences
- Exploration of cross-activity transfer learning
- Integration of insights from hand-crafted feature approaches

## Detailed Report
For in-depth technical information and project details, please refer to the full research report:
- [Self-Supervised Human Activity Recognition Report](http://tonyyunyang.github.io/images/project/ra_mlm_har/ra_report.pdf)