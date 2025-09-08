# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Streamlit-based web application for visualizing stock moving averages using Yahoo Finance data. The application displays stock price charts with 120-day and 200-day moving averages, highlighting points where the moving average slopes are at their lowest values.

## Architecture

- **Single-file application**: `yfiance-ma.py` contains the entire Streamlit app
- **Dependencies**: Listed in `requirement.txt` (note the typo in filename)
- **Data source**: Yahoo Finance via `yfinance` library
- **Visualization**: Plotly for interactive charts
- **UI framework**: Streamlit for web interface

## Development Commands

### Setup
```bash
pip install -r requirement.txt
```

### Running the Application
```bash
streamlit run yfiance-ma.py
```

### Key Dependencies
- `streamlit`: Web app framework
- `yfinance`: Yahoo Finance data fetching
- `pandas`: Data manipulation
- `plotly`: Interactive charting
- `datetime`: Date handling
- `numpy`: Numerical operations

## Code Structure

The main file `yfiance-ma.py` follows this flow:
1. Streamlit page configuration and UI setup
2. User input handling (ticker symbol and time period)
3. Data fetching from Yahoo Finance
4. Moving average calculations (120-day and 200-day)
5. Slope analysis to find lowest slope points
6. Plotly chart generation and display

## Key Features

- Interactive ticker input with suggested symbols
- Configurable time periods (3, 6, 9, 12 years, or max)
- Real-time stock data visualization
- Moving average trend analysis with slope calculations
- Visual markers for significant trend points
- Responsive chart layout

## Notes

- The requirements file has a typo: `requirement.txt` should be `requirements.txt`
- News functionality is commented out in the code
- No testing framework is currently implemented
- No build process or packaging configuration exists