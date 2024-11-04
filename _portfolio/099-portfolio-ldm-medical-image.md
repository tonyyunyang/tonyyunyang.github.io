---
title: "Medical Image Generation with Conditional LDM incorporating anatomy-compliant synthesis"
excerpt: "Engineered a specialized Stable Diffusion model to generate high-fidelity medical images<br/><img src='/images/project/ldm_medical_image/reconstruction_progress_loop.gif' width='1000'>"
collection: portfolio
---

## Project Overview
We implemented a Conditional Latent Diffusion Model (LDM) for medical image generation, using edge detection and semantic mapping as conditional inputs. The project utilized the [M&M's Challenge dataset](https://www.ub.edu/mnms-2/), achieving promising reconstruction results while identifying areas for improvement in generation quality.

## Examples of Generated Images

<embed src="/images/project/ldm_medical_image/comparison_batch_19.pdf" type="application/pdf" width="1000" height="800">

<embed src="/images/project/ldm_medical_image/comparison_batch_39.pdf" type="application/pdf" width="1000" height="800">

## Key Technologies
- Edge Detection: Canny Edge Algorithm with noise reduction
- Semantic Mapping: Four-channel one-hot encoded representation
- VQVAE: For efficient image encoding and reconstruction
- UNet: As the backbone for the LDM
- HDF5: For optimized data storage and access

## Development Process
### Data Preprocessing
- Processed 360 subjects from M&M's Challenge dataset
- Split: 350 training, 10 validation
- Combined long-axis and short-axis cardiac images
- Normalized to 256×256 resolution


### Model Architecture
- Latent Space: 32×32×3 with 16,834 codebook size
- Network Structure:
  - Uniform block depth: 2
  - Down-block channels: [256, 384, 512, 768]
  - Mid-block channels: [768, 512]
  - Self-Attention heads: 8

### Training Configuration
- VQVAE learning rate: 8.0e-5
- UNet learning rate: 8.0e-6
- Batch size: 36
- Dropout rate: 0.1
- Diffusion steps: 1,000

### Performance Evaluation
- FID: 116.09
- SSIM: 0.44
- NMSE: 1.14

## Challenges and Insights
- Mixed View Challenge: Combining long-axis and short-axis views introduced spatial complexity
- Edge Map Practicality: Detailed edge maps may not reflect real-world user inputs
- Training Limitations: Hyperparameter exploration and training duration were constrained

## Future Directions
Explore separating long-axis and short-axis image training
- Investigate natural language conditioning inspired by clinical Llama applications
- Further hyperparameter optimization and extended training
- Consider alternative conditioning approaches for practical deployment

## Detailed Reports
The detailed report can be found [here](http://tonyyunyang.github.io/images/project/ldm_medical_image/report.pdf).