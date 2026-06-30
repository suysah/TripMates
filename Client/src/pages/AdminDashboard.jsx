import React from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import { FaMoneyBillWave, FaSuitcase, FaUsers, FaStar } from "react-icons/fa";

const AdminDashboard = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch bookings, users, and tours
  const fetchBookings = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load bookings");
    return data?.data?.data || [];
  };

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/`, { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load users");
    return data?.data?.data || [];
  };

  const fetchTours = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load tours");
    return data?.data?.data || [];
  };

  const { data: bookings, isLoading: loadingB } = useQuery({
    queryKey: ["admin-dash-bookings"],
    queryFn: fetchBookings,
  });

  const { data: users, isLoading: loadingU } = useQuery({
    queryKey: ["admin-dash-users"],
    queryFn: fetchUsers,
  });

  const { data: tours, isLoading: loadingT } = useQuery({
    queryKey: ["admin-dash-tours"],
    queryFn: fetchTours,
  });

  if (loadingB || loadingU || loadingT) return <Spinner />;

  // 1. Compute KPIs
  const totalRevenue = bookings ? bookings.reduce((acc, curr) => acc + (curr.paid ? curr.price : 0), 0) : 0;
  const bookingsCount = bookings ? bookings.length : 0;
  const usersCount = users ? users.length : 0;
  
  // Calculate average rating
  let totalRating = 0;
  let toursWithRatings = 0;
  if (tours) {
    tours.forEach((t) => {
      if (t.ratingsAverage) {
        totalRating += t.ratingsAverage;
        toursWithRatings++;
      }
    });
  }
  const avgRating = toursWithRatings > 0 ? (totalRating / toursWithRatings).toFixed(1) : "4.5";

  // 2. Prepare charts data
  // 2a. Monthly Revenue (for Line Chart)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyDataMap = monthNames.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {});

  if (bookings) {
    bookings.forEach((b) => {
      if (b.paid && b.createdAt) {
        const date = new Date(b.createdAt);
        const monthName = monthNames[date.getMonth()];
        monthlyDataMap[monthName] += b.price;
      }
    });
  }

  const monthlyRevenueData = monthNames.map((month) => ({
    label: month,
    value: monthlyDataMap[month],
  }));

  // 2b. Bookings per Tour (for Bar Chart)
  const tourBookingsMap = {};
  if (bookings) {
    bookings.forEach((b) => {
      const name = b.tour?.name || "Deleted Tour";
      tourBookingsMap[name] = (tourBookingsMap[name] || 0) + 1;
    });
  }

  const tourBookingsData = Object.keys(tourBookingsMap)
    .map((name) => ({ label: name, value: tourBookingsMap[name] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 tours

  // 3. Draw custom SVG line chart
  const maxRevenue = Math.max(...monthlyRevenueData.map((d) => d.value), 1000);
  const chartHeight = 220;
  const chartWidth = 550;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  // Calculate points
  const points = monthlyRevenueData.map((d, index) => {
    const x = paddingLeft + (index / (monthlyRevenueData.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - (d.value / maxRevenue) * graphHeight;
    return { x, y, label: d.label, value: d.value };
  });

  const pathD = points.length > 0 ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ") : "";
  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z` : "";

  // 4. Draw custom SVG bar chart
  const maxBookings = Math.max(...tourBookingsData.map((d) => d.value), 5);
  const barChartHeight = 220;
  const barChartWidth = 550;
  const barPaddingLeft = 140; // more space for long tour names
  const barPaddingRight = 20;
  const barPaddingTop = 20;
  const barPaddingBottom = 30;
  const barGraphWidth = barChartWidth - barPaddingLeft - barPaddingRight;
  const barGraphHeight = barChartHeight - barPaddingTop - barPaddingBottom;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-teal-800">Admin Dashboard 📊</h2>
        <p className="text-gray-500 text-sm">Real-time statistics and financial metrics overview</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Sales</p>
            <h3 className="text-2xl font-bold text-teal-900 mt-1">${totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl">
            <FaMoneyBillWave className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Bookings</p>
            <h3 className="text-2xl font-bold text-teal-900 mt-1">{bookingsCount}</h3>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <FaSuitcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Users</p>
            <h3 className="text-2xl font-bold text-teal-900 mt-1">{usersCount}</h3>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <FaUsers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Avg Tour Rating</p>
            <h3 className="text-2xl font-bold text-teal-900 mt-1">{avgRating} ⭐</h3>
          </div>
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
            <FaStar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Line Chart: Monthly Revenue */}
        <div className="bg-white border rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-teal-800 mb-4">Monthly Revenue Trend ($)</h3>
          <div className="flex justify-center items-center overflow-x-auto">
            <svg width={chartWidth} height={chartHeight} className="overflow-visible">
              <defs>
                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                const y = paddingTop + r * graphHeight;
                const valueLabel = Math.round(maxRevenue * (1 - r));
                return (
                  <g key={i}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      fill="#94a3b8"
                      className="text-[10px] font-semibold"
                    >
                      ${valueLabel}
                    </text>
                  </g>
                );
              })}

              {/* Chart Shaded Area */}
              {areaD && <path d={areaD} fill="url(#chart-area-grad)" />}

              {/* Chart Line Path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points (circles) & labels */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                    className="hover:r-6 cursor-pointer transition-all"
                  />
                  {p.value > 0 && (
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      fill="#0f172a"
                      className="text-[9px] font-bold"
                    >
                      ${p.value}
                    </text>
                  )}
                  {/* X Axis Labels */}
                  <text
                    x={p.x}
                    y={paddingTop + graphHeight + 20}
                    textAnchor="middle"
                    fill="#94a3b8"
                    className="text-[10px] font-bold"
                  >
                    {p.label}
                  </text>
                </g>
              ))}

              {/* X Axis Line */}
              <line
                x1={paddingLeft}
                y1={paddingTop + graphHeight}
                x2={chartWidth - paddingRight}
                y2={paddingTop + graphHeight}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Bar Chart: Bookings per Tour */}
        <div className="bg-white border rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-teal-800 mb-4">Top 5 Booked Tours</h3>
          <div className="flex justify-center items-center overflow-x-auto">
            {tourBookingsData.length === 0 ? (
              <div className="flex items-center justify-center h-48 w-full text-gray-400 italic text-sm">
                No booking statistics available.
              </div>
            ) : (
              <svg width={barChartWidth} height={barChartHeight} className="overflow-visible">
                {/* Y Axis Grid (Vertical lines for values) */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                  const x = barPaddingLeft + r * barGraphWidth;
                  const valueLabel = Math.round(maxBookings * r);
                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        y1={barPaddingTop}
                        x2={x}
                        y2={barChartHeight - barPaddingBottom}
                        stroke="#f1f5f9"
                        strokeWidth="1.5"
                      />
                      <text
                        x={x}
                        y={barChartHeight - barPaddingBottom + 16}
                        textAnchor="middle"
                        fill="#94a3b8"
                        className="text-[10px] font-bold"
                      >
                        {valueLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Bars */}
                {tourBookingsData.map((d, i) => {
                  const barHeight = 20;
                  const spacing = (barGraphHeight - barHeight * tourBookingsData.length) / (tourBookingsData.length - 1 || 1);
                  const y = barPaddingTop + i * (barHeight + spacing);
                  const width = (d.value / maxBookings) * barGraphWidth;

                  // Truncate long tour names for labels
                  const labelText = d.label.length > 18 ? d.label.substring(0, 16) + "..." : d.label;

                  return (
                    <g key={i}>
                      {/* Tour Name Y Axis Label */}
                      <text
                        x={barPaddingLeft - 10}
                        y={y + 14}
                        textAnchor="end"
                        fill="#475569"
                        className="text-[11px] font-semibold"
                        title={d.label}
                      >
                        {labelText}
                      </text>
                      {/* Color Fill Bar */}
                      <rect
                        x={barPaddingLeft}
                        y={y}
                        width={width}
                        height={barHeight}
                        rx="4"
                        fill="#0ea5e9"
                        className="transition-all duration-500 ease-out hover:fill-sky-600"
                      />
                      {/* Bar Value Indicator */}
                      <text
                        x={barPaddingLeft + width + 8}
                        y={y + 14}
                        textAnchor="start"
                        fill="#0f172a"
                        className="text-[11px] font-bold"
                      >
                        {d.value}
                      </text>
                    </g>
                  );
                })}

                {/* Y Axis Line */}
                <line
                  x1={barPaddingLeft}
                  y1={barPaddingTop}
                  x2={barPaddingLeft}
                  y2={barChartHeight - barPaddingBottom}
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
