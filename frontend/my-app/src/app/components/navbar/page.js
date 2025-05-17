"use client";
import { useDispatch } from "react-redux";
import styles from "../../styles/navbar.module.css";
import {
  SET_SEARCH_QUERY,
  SET_PRIORITY_FILTER,
  SET_STATUS_FILTER,
  SET_DUE_DATE_FILTER
} from "../../redux/actionTypes";

export default function Navbar() {
  const dispatch = useDispatch();

  // Handle search input and dispatch it to redux store
  const handleSearchChange = (e) => {
    dispatch({
      type: SET_SEARCH_QUERY,
      payload: e.target.value,
    });
  };

  // Filter: Priority
  const handlePriorityFilterChange = (e) => {
    dispatch({
      type: SET_PRIORITY_FILTER,
      payload: e.target.value,
    });
  };

  // Filter: Status
  const handleStatusFilterChange = (e) => {
    dispatch({
      type: SET_STATUS_FILTER,
      payload: e.target.value,
    });
  };

  // Filter: Due Date sorting (asc/desc)
  const handleDueDateFilterChange = (e) => {
    dispatch({
      type: SET_DUE_DATE_FILTER,
      payload: e.target.value,
    });
  };

  return (
    <div className={styles.navbar}>
      {/* Search bar section */}
      <div className={styles.searchContainer}>
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Search..."
          className={styles.searchInput}
          onChange={handleSearchChange}
        />
      </div>

      {/* Dropdown filters for Priority, Status, Due Date */}
      <div className={styles.filters}>
        {/* Priority Filter */}
        <select
          className={styles.filterDropdown}
          onChange={handlePriorityFilterChange}
          defaultValue=""
        >
          <option value="">Priority (All)</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Status Filter */}
        <select
          className={styles.filterDropdown}
          onChange={handleStatusFilterChange}
          defaultValue=""
        >
          <option value="">Status (All)</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Due Date Sort Filter */}
        <select
          className={styles.filterDropdown}
          onChange={handleDueDateFilterChange}
          defaultValue=""
        >
          <option value="">Due Date (All)</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
