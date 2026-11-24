import { forwardRef, ReactNode, HTMLAttributes, useMemo, useRef, useEffect } from "react";
import "./Table.css";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
}

export interface TableProps<T> extends HTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  emptyState?: ReactNode;
  loading?: boolean;
  stickyHeader?: boolean;
  caption?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  emptyState,
  loading = false,
  stickyHeader = true,
  caption,
  className = "",
  ...props
}: TableProps<T>) {
  const sortedColumns = useMemo(() => columns, [columns]);

  const handleRowClick = (row: T, e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) {
      return;
    }
    onRowClick?.(row);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newKeys = new Set(data.map(keyExtractor));
      onSelectionChange?.(newKeys);
    } else {
      onSelectionChange?.(new Set());
    }
  };

  const handleSelectRow = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeys = new Set(selectedKeys);
    if (e.target.checked) {
      newKeys.add(key);
    } else {
      newKeys.delete(key);
    }
    onSelectionChange?.(newKeys);
  };

  const allSelected = data.length > 0 && data.every((row) => selectedKeys.has(keyExtractor(row)));
  const someSelected = data.some((row) => selectedKeys.has(keyExtractor(row)));

  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  if (loading) {
    return (
      <div className="table-wrapper" role="region" aria-label="Loading table">
        <table className={`table ${className}`} {...props}>
          <thead>
            <tr>
              {selectable && <th className="table__th table__th--checkbox" style={{ width: "48px" }} />}
              {sortedColumns.map((col) => (
                <th key={col.key} className="table__th" style={{ width: col.width, textAlign: col.align }}>
                  <div className="table__th-content">{col.header}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="table__tr table__tr--skeleton">
                {selectable && <td className="table__td" />}
                {sortedColumns.map((col) => (
                  <td key={col.key} className="table__td">
                    <div className="skeleton" style={{ height: "1rem", width: "80%" }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-wrapper" role="region" aria-label={caption || "Table"}>
        <table className={`table ${className}`} {...props}>
          {caption && <caption className="table__caption">{caption}</caption>}
          <thead>
            <tr>
              {selectable && <th className="table__th table__th--checkbox" style={{ width: "48px" }} />}
              {sortedColumns.map((col) => (
                <th key={col.key} className="table__th" style={{ width: col.width, textAlign: col.align }}>
                  <div className="table__th-content">{col.header}</div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="table__empty">
          {emptyState || (
            <>
              <div className="table__empty-icon" aria-hidden="true">📋</div>
              <h4 className="table__empty-title">No data</h4>
              <p className="table__empty-description">No rows to display</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper" role="region" aria-label={caption || "Table"}>
      <div className="table__scroll">
        <table className={`table ${stickyHeader ? "table--sticky-header" : ""} ${className}`} {...props}>
          {caption && <caption className="table__caption">{caption}</caption>}
          <thead>
            <tr className="table__tr">
              {selectable && (
                <th className="table__th table__th--checkbox" style={{ width: "48px" }}>
                  <label className="table__checkbox-label">
                    <input
                      ref={selectAllCheckboxRef}
                      type="checkbox"
                      className="table__checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                    <span className="table__checkbox-visual" aria-hidden="true" />
                  </label>
                </th>
              )}
              {sortedColumns.map((col) => (
                <th
                  key={col.key}
                  className="table__th"
                  style={{ width: col.width, textAlign: col.align }}
                  scope="col"
                >
                  <div className="table__th-content">{col.header}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const key = keyExtractor(row);
              const isSelected = selectedKeys.has(key);
              return (
                <tr
                  key={key}
                  className={`table__tr ${onRowClick ? "table__tr--clickable" : ""} ${isSelected ? "table__tr--selected" : ""}`}
                  onClick={(e) => handleRowClick(row, e)}
                >
                  {selectable && (
                    <td className="table__td table__td--checkbox">
                      <label className="table__checkbox-label">
                        <input
                          type="checkbox"
                          className="table__checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e)}
                        />
                        <span className="table__checkbox-visual" aria-hidden="true" />
                      </label>
                    </td>
                  )}
                  {sortedColumns.map((col) => (
                    <td
                      key={col.key}
                      className="table__td"
                      style={{ textAlign: col.align }}
                    >
                      {col.render ? col.render(row, index) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================================
   RESPONSIVE CARD STACK (for mobile)
   ============================================================================ */

export interface ResponsiveTableProps<T> extends Omit<TableProps<T>, "stickyHeader"> {
  cardRender?: (row: T) => ReactNode;
}

export function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  emptyState,
  loading = false,
  caption,
  cardRender,
  className = "",
  ...props
}: ResponsiveTableProps<T>) {
  return (
    <div className="responsive-table">
      {/* Desktop: Table */}
      <div className="responsive-table__desktop">
        <Table
          columns={columns}
          data={data}
          keyExtractor={keyExtractor}
          onRowClick={onRowClick}
          selectable={selectable}
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          emptyState={null}
          loading={loading}
          stickyHeader={true}
          caption={caption}
          className={className}
          {...props}
        />
      </div>

      {/* Mobile: Card Stack */}
      <div className="responsive-table__mobile" aria-hidden="true">
        {data.map((row, index) => (
          <div key={keyExtractor(row)} className="responsive-table__card card card--padding-md">
            {selectable && (
              <label className="responsive-table__card-checkbox">
                <input
                  type="checkbox"
                  className="table__checkbox"
                  checked={selectedKeys.has(keyExtractor(row))}
                  onChange={(e) => {
                    const newKeys = new Set(selectedKeys);
                    if (e.target.checked) newKeys.add(keyExtractor(row));
                    else newKeys.delete(keyExtractor(row));
                    onSelectionChange?.(newKeys);
                  }}
                />
                <span className="table__checkbox-visual" aria-hidden="true" />
              </label>
            )}
            {cardRender
              ? cardRender(row)
              : columns.map((col) => (
                  <div key={col.key} className="responsive-table__card-row">
                    <span className="responsive-table__card-label">{col.header}</span>
                    <span className="responsive-table__card-value">
                      {col.render ? col.render(row, index) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </span>
                  </div>
                ))}
          </div>
        ))}
        {data.length === 0 && !loading && (
          <div className="table__empty" style={{ padding: "var(--space-8)" }}>
            {emptyState || (
              <>
                <div className="table__empty-icon" aria-hidden="true">📋</div>
                <h4 className="table__empty-title">No data</h4>
                <p className="table__empty-description">No rows to display</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}