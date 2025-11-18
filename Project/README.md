# Light Switch Experiment Interface

A React-based research experiment interface for comparing Traditional vs Floor Plan switch interfaces. This application runs entirely in the frontend with CSV export functionality - no backend or database required.

## Features

### Participant Interface (SwitchPanel.jsx)
- **Two Design Types**: Traditional switch panel or Floor Plan layout
- **Interactive Switches**: Click switches to toggle lights (Areas A, B, C, D)
- **Visual Feedback**: Real-time visual indicators for switch states
- **Target Indicators**: Shows which areas need to be activated
- **Task Status**: Displays current task state and completion status

### Floor Plan Display (FloorPlanDisplay.jsx)
- **Live Light Visualization**: Real-time display of all light states
- **Area Labels**: Clear labeling of Areas A, B, C, D
- **Status Indicators**: Visual ON/OFF states with glow effects
- **Target Highlighting**: Shows which areas are targets for the current task

### Moderator Dashboard (ModeratorPanel.jsx)
- **Participant Management**: Enter participant ID and group
- **Task Control**: Start tasks, mark success/failure, advance to next condition
- **Real-time Monitoring**: Live timer and error counter
- **Condition Configuration**: Pre-defined experiment conditions (design type, light status, targets)
- **Notes**: Add notes for each condition

### Data Logger (RecorderPanel.jsx)
- **Current Log Display**: Shows all relevant task data
- **Data Table**: Complete record of all experiment trials
- **CSV Export**: Export all data to CSV file
- **Performance Summary**: Learning curve visualization

### Survey Form (SurveyForm.jsx)
- **NASA-TLX**: 6-dimension workload assessment (0-20 scale)
- **Confidence Rating**: 1-7 Likert scale
- **Preference Question**: Traditional vs Floor Plan preference

## Data Flow

1. **Task Start**: Moderator clicks "Start Task" → system records start time
2. **Participant Interaction**: Each switch press updates light states and validates against targets
3. **Error Tracking**: Incorrect switches increment error counter
4. **Task Completion**: Automatic detection when all targets are ON and non-targets are OFF
5. **Data Logging**: Task data automatically saved (time, errors, success)
6. **Survey**: Participant completes NASA-TLX and preference survey
7. **CSV Export**: All data can be exported to CSV for analysis

## Project Structure

```
src/
├── context/
│   └── ExperimentContext.js    # Global state management
├── components/
│   ├── SwitchPanel.jsx         # Participant interface
│   ├── FloorPlanDisplay.jsx    # Floor plan view
│   ├── ModeratorPanel.jsx      # Moderator dashboard
│   ├── RecorderPanel.jsx       # Data logger
│   └── SurveyForm.jsx          # Survey interface
├── App.js                      # Main application
├── index.js                    # Entry point
└── index.css                   # Global styles
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### View Modes

The application supports three view modes (toggle via header buttons):

1. **Moderator View**: Full moderator dashboard with data logger
2. **Participant View**: Clean interface for participants with survey access
3. **Split View**: Side-by-side view for dual-screen setup (Laptop 1 = Participant, Laptop 2 = Moderator)

### Running an Experiment

1. **Set Up Participant**: In Moderator View, enter Participant ID and Group
2. **Start Task**: Click "Start Task" - this will configure the condition (design type, light status, targets)
3. **Participant Interacts**: Participant uses Switch Panel to toggle lights
4. **Monitor Progress**: Moderator sees real-time timer and error count
5. **Task Completion**: Automatically detected when correct lights are toggled
6. **Survey**: Participant completes survey after task
7. **Next Condition**: Moderator clicks "Next Condition" to advance
8. **Export Data**: Use Recorder Panel to export all data to CSV

## CSV Export Format

The exported CSV includes the following columns:

- `participant_id`: Participant identifier
- `group`: Experimental group (A, B, C, etc.)
- `design_type`: "traditional" or "floorplan"
- `lights_status`: "allOff", "allOn", or "mixed"
- `task_type`: Task type (currently "single")
- `target_areas`: Comma-separated target areas (e.g., "A,B")
- `completion_time`: Task duration in seconds
- `errors`: Number of incorrect switches
- `success`: Boolean (true/false)
- `nasa_tlx`: NASA-TLX score (average of 6 dimensions)
- `confidence`: Confidence rating (1-7)
- `preference`: "traditional", "floorplan", or "no_preference"
- `timestamp`: ISO timestamp of record

## Experiment Conditions

The system includes 6 pre-defined conditions:

1. Traditional + All Off + Targets A,B
2. Traditional + All On + Target C
3. Traditional + Mixed + Targets A,D
4. Floor Plan + All Off + Targets B,C
5. Floor Plan + All On + Target A
6. Floor Plan + Mixed + Targets C,D

Conditions can be customized in `ModeratorPanel.jsx`.

## Technologies Used

- React 18
- React Context API (state management)
- Tailwind CSS (styling)
- CSV export (client-side)
- No backend/database required

## Notes

- All data is stored in browser memory (React state)
- Data persists only during the session
- Export CSV regularly to save data
- The application is designed for single-session experiments
- For multi-session studies, consider implementing localStorage or file-based persistence
