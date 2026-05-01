import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { patchDraftDocxFieldsTotals } from '@entities/upload-excel/lib';
import { initialState } from '../../config';
import type { Store } from '../../types';

export const usePageStore = create<Store>()(
  immer((set) => ({
    loading: initialState.loading,
    isFileLoaded: initialState.isFileLoaded,
    modal: initialState.modal,
    tableData: initialState.tableData,
    originalTableData: initialState.originalTableData,
    counterparties: initialState.counterparties,
    headerFields: initialState.headerFields,
    footerFields: initialState.footerFields,
    docxFields: initialState.docxFields,
    sourceFileName: initialState.sourceFileName,
    rawRowsCount: initialState.rawRowsCount,
    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),
    setFileLoaded: (loaded) =>
      set((state) => {
        state.isFileLoaded = loaded;
      }),
    setTableData: (data) =>
      set((state) => {
        state.tableData = data;
        patchDraftDocxFieldsTotals(state.docxFields, data);
      }),
    setOriginalTableData: (data) =>
      set((state) => {
        state.originalTableData = data;
      }),
    setCounterparties: (data) =>
      set((state) => {
        state.counterparties = data;
      }),
    setHeaderFields: (data) =>
      set((state) => {
        state.headerFields = data;
      }),
    setFooterFields: (data) =>
      set((state) => {
        state.footerFields = data;
      }),
    setDocxFields: (data) =>
      set((state) => {
        state.docxFields = data;
      }),
    setSourceFileName: (value) =>
      set((state) => {
        state.sourceFileName = value;
      }),
    setRawRowsCount: (value) =>
      set((state) => {
        state.rawRowsCount = value;
      }),
    deleteSelectedRows: (selectedIds) =>
      set((state) => {
        const selectedSet = new Set(selectedIds.map(String));
        state.tableData = state.tableData.filter(
          (row) => !selectedSet.has(String(row.id ?? row.index))
        );
        state.rawRowsCount = state.tableData.length;
        patchDraftDocxFieldsTotals(state.docxFields, state.tableData);
      }),
    openModal: (params) =>
      set((state) => {
        state.modal.name = params.name;
        state.modal.params = params.params ?? null;
        state.modal.onSubmit = params.onSubmit;
        state.modal.onApply = params.onApply;
        state.modal.onCancel = params.onCancel;
      }),
    closeModal: () =>
      set((state) => {
        state.modal.name = '';
        state.modal.params = null;
        state.modal.onSubmit = undefined;
        state.modal.onApply = undefined;
        state.modal.onCancel = undefined;
      }),
  }))
);


