---
title: "Global Flood Evacuation System with Big Data"
excerpt: "Developed a scalable, real-time evacuation planning system for global flood scenarios using big data technologies<br/><img src='/images/project/big_data/teaser.png' width='600'>"
collection: portfolio
---

# Global Flood Evacuation System: From Local to Worldwide Planning

## Project Overview
We developed a comprehensive, scalable evacuation planning system to address global flood scenarios. The project evolved through three phases, starting with a local focus on the Netherlands and scaling up to worldwide coverage, incorporating big data technologies for real-time processing and analysis.

## Key Technologies
- **Apache Spark**: For distributed data processing and analysis
- **Amazon Web Services (AWS)**: For scalable cloud computing resources
- **Apache Kafka**: For real-time data streaming and processing
- **H3 Geospatial Indexing**: For efficient geospatial calculations
- **OpenStreetMap Data**: For geographical and population information
- **Parquet and ORC File Formats**: For efficient big data storage and retrieval

## Development Process

1. **Phase 1: Netherlands Evacuation Planning**
   - Implemented initial evacuation algorithm using Apache Spark
   - Processed OpenStreetMap data for the Netherlands
   - Utilized H3 indexing for geospatial calculations
   - Achieved efficient data processing for a single country

2. **Phase 2: Scaling to Global Evacuation Planning**
   - Migrated to AWS for increased computational power
   - Optimized data processing for planetary-scale datasets
   - Implemented precomputation techniques for elevation data
   - Achieved significant performance improvements, reducing processing time from hours to minutes

3. **Phase 3: Real-time Evacuation Updates**
   - Integrated Apache Kafka for real-time data streaming
   - Developed a stateful stream processing application
   - Implemented time-windowed aggregations for dynamic updates
   - Created a system capable of handling continuous, global-scale updates

## Key Innovations

1. **Planetary Elevation Precomputation**: Significantly reduced processing time by precomputing average elevations for H3 indices globally.

2. **Scalable Cluster Configuration**: Optimized AWS cluster configurations for both precomputed and non-precomputed scenarios, balancing performance and cost.

3. **Real-time Update System**: Developed a Kafka-based system capable of processing global-scale evacuation updates in real-time, with configurable time windows.

## Performance Highlights
- Reduced global evacuation plan computation from hours to under 5 minutes
- Achieved real-time updates for global refugee movements
- Optimized cost-efficiency, reducing AWS expenses while maintaining performance

## Future Work
Potential areas for future development include:
- Integration with real-time weather and flood prediction models
- Development of a user-facing application for public evacuation guidance
- Further optimization of data processing pipelines for even faster global-scale computations

## Detailed Reports
For in-depth technical information and project progression, please refer to our series of reports:
- [Netherlands Evacuation Planning](https://hackmd.io/@7vnc7zWuQNWxQUXKv-QufQ/r1ODziOaR)
- [Global-Scale Evacuation System](https://hackmd.io/@7vnc7zWuQNWxQUXKv-QufQ/By13zju6R)
- [Real-Time Evacuation Updates](https://hackmd.io/@7vnc7zWuQNWxQUXKv-QufQ/By0Rfo_6C)