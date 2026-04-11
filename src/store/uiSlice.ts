import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export type PanelId =
  | 'overview' | 'criteria' | 'gaps' | 'tasks' | 'insights' | 'evidence'
  | 'activity' | 'co-po' | 'audit' | 'export' | 'part-a' | 'part-d'
  | 'admin' | 'sar' | 'docsearch' | 'reports' | 'settings' | 'fdash' | 'sar-generator'
  | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9';

interface UIState {
  sidebarCollapsed: boolean;
  activePanel: PanelId;
  severityFilter: string | null;
  assigneeFilter: string | null;
  activeCriterionId: string | null;
  department: string;
  academicYear: string;
  globalSearch: string;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activePanel: 'overview',
  severityFilter: null,
  assigneeFilter: null,
  activeCriterionId: null,
  department: 'Electrical',
  academicYear: '2024-25',
  globalSearch: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) { state.sidebarCollapsed = action.payload; },
    setActivePanel(state, action: PayloadAction<PanelId>) { state.activePanel = action.payload; },
    setSeverityFilter(state, action: PayloadAction<string | null>) { state.severityFilter = action.payload; },
    setAssigneeFilter(state, action: PayloadAction<string | null>) { state.assigneeFilter = action.payload; },
    setActiveCriterion(state, action: PayloadAction<string | null>) { state.activeCriterionId = action.payload; },
    setDepartment(state, action: PayloadAction<string>) { state.department = action.payload; },
    setAcademicYear(state, action: PayloadAction<string>) { state.academicYear = action.payload; },
    setGlobalSearch(state, action: PayloadAction<string>) { state.globalSearch = action.payload; },
  },
});

export const {
  toggleSidebar, setSidebarCollapsed, setActivePanel,
  setSeverityFilter, setAssigneeFilter, setActiveCriterion,
  setDepartment, setAcademicYear, setGlobalSearch,
} = uiSlice.actions;

export const selectSidebarCollapsed = (s: RootState) => s.ui.sidebarCollapsed;
export const selectActivePanel      = (s: RootState) => s.ui.activePanel;
export const selectSeverityFilter   = (s: RootState) => s.ui.severityFilter;
export const selectAssigneeFilter   = (s: RootState) => s.ui.assigneeFilter;
export const selectActiveCriterion  = (s: RootState) => s.ui.activeCriterionId;
export const selectDepartment       = (s: RootState) => s.ui.department;
export const selectAcademicYear     = (s: RootState) => s.ui.academicYear;
export const selectGlobalSearch     = (s: RootState) => s.ui.globalSearch;

export default uiSlice.reducer;
