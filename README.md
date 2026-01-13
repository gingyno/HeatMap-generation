# HeatMap Generation

Eye tracking data visualization tool that generates heatmaps from fixation data overlaid on text content using HTML, CSS, and JavaScript.

## Overview

This project processes eye tracking data to create visual heatmaps showing where users focus their attention while reading text. The visualization helps analyze reading patterns and user engagement.

## Data Format

The input data contains:
- User ID
- Fixation point X coordinate
- Fixation point Y coordinate
- Fixation duration (milliseconds)

*Note: Due to data sensitivity, sample datasets are not included in this repository.*

## Versions

### HeatMapV1 - Dot Visualization
Early prototype that places individual dots at fixation coordinates. Color intensity represents time spent at each location.

**Features:**
- Simple dot-based visualization
- Color-coded by duration
- Basic fixation point mapping

### HeatMapV2 - Gradient Visualization
Enhanced version using gradient transitions for smoother visual representation.

**Improvements:**
- Gradient color transitions
- Better visual continuity
- Improved time-based color mapping

### HeatMapV3 - True HeatMap (In Progress)
Advanced implementation generating authentic heatmaps with spatial interpolation.

**Features:**
- True heatmap generation with blur effect
- Spatial intensity distribution

**Known Issues:**
- Bug prevents heatmap generation for all users (only generates for a subset)
- Currently investigating root cause

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
