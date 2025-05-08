"use client";
import { useDispatch } from "react-redux";
import styles from "../../styles/navbar.module.css";
import { STOP, SET_SEARCH_QUERY, SET_PRIORITY_FILTER, SET_STATUS_FILTER, SET_DUE_DATE_FILTER } from "../../redux/actionTypes";

export default function Navbar() {
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    dispatch({ 
      type: SET_SEARCH_QUERY, 
      payload: e.target.value 
    });
  };

  const handlePriorityFilterChange = (e) => {
    dispatch({
      type: SET_PRIORITY_FILTER,
      payload: e.target.value
    });
  };

  const handleStatusFilterChange = (e) => {
    dispatch({
      type: SET_STATUS_FILTER,
      payload: e.target.value
    });
  };

  const handleDueDateFilterChange = (e) => {
    dispatch({
      type: SET_DUE_DATE_FILTER,
      payload: e.target.value
    });
  };

  return (
    <div className={styles.navbar}>
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

      {/* Filters */}
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

        {/* Due Date Filter */}
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

      {/* Notification & Profile */}
      <div className={styles.actions}>
        <div className={styles.notificationIcon} onClick={()=>{ dispatch( { type:STOP } ) }} >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notificationBadge}>5</span>
        </div>

        {/* <div className={styles.profileImage}>
        </div> */}
      </div>
    </div>
  );
}