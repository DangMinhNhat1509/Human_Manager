import React, { useState, useEffect, useCallback } from "react";
import { getChartStatistics, getStatisticsCounts } from "../services/reward_discipline_service";
import { getAllDepartments } from "../../employee/services/employee_service";
import { Card, DatePicker, message, Radio, RadioChangeEvent } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { ActionType } from "../../../types/action";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { RangePicker } = DatePicker;

const ReportPage: React.FC = () => {
    const [counts, setCounts] = useState({ rewardCount: 0, disciplineCount: 0 });
    const [departmentCounts, setDepartmentCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
        dayjs().startOf("day"),
        dayjs().endOf("day"),
    ]);
    const [filterType, setFilterType] = useState<string>("today");
    const [departments, setDepartments] = useState<{ id: number, name: string }[]>([]);
    const [selectedActionType, setSelectedActionType] = useState<ActionType>(ActionType.Reward);
    const [pendingCount, setPendingCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);

    const fetchCounts = useCallback(async (startDate: string, endDate: string) => {
        try {
            setLoading(true);
            const counts = await getChartStatistics(null, startDate, endDate);
            setCounts({
                rewardCount: counts[ActionType.Reward] || 0,
                disciplineCount: counts[ActionType.Disciplinary] || 0,
            });

            const stats = await getStatisticsCounts(null, startDate, endDate);
            setPendingCount(stats.pending);
            setTotalCount(stats.total);
            setRejectedCount(stats.rejected);
            setApprovedCount(stats.approved);

            const allDepartmentCounts = await getAllDepartments();
            const departmentIds = allDepartmentCounts.map(dep => dep.departmentId);

            const departmentData: Record<string, number> = {};
            for (const deptId of departmentIds) {
                const data = await getChartStatistics(deptId, startDate, endDate);
                departmentData[deptId] = selectedActionType === ActionType.Reward 
                    ? data[ActionType.Reward] || 0 
                    : data[ActionType.Disciplinary] || 0;
            }

            setDepartmentCounts(departmentData);
        } catch (error) {
            message.error("Lỗi khi lấy số lượng khen thưởng và kỷ luật!");
        } finally {
            setLoading(false);
        }
    }, [selectedActionType]);

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            fetchCounts(dateRange[0].format("YYYY-MM-DD"), dateRange[1].format("YYYY-MM-DD"));
        }
    }, [dateRange, fetchCounts]);

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange(dates as [Dayjs, Dayjs]);
        } else {
            setDateRange([dayjs().startOf("day"), dayjs().endOf("day")]);
        }
    };

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const departments = await getAllDepartments();
                setDepartments(departments.map(dep => ({ id: dep.departmentId, name: dep.departmentName })));
            } catch (error) {
                message.error("Lỗi khi lấy danh sách phòng ban");
            }
        };
        loadDepartments();
    }, []);

    const handleFilterChange = (e: RadioChangeEvent) => {
        const value = e.target.value;
        setFilterType(value);
        switch (value) {
            case "today":
                setDateRange([dayjs().startOf("day"), dayjs().endOf("day")]);
                break;
            case "week":
                setDateRange([dayjs().startOf("week"), dayjs().endOf("week")]);
                break;
            case "month":
                setDateRange([dayjs().startOf("month"), dayjs().endOf("month")]);
                break;
            case "year":
                setDateRange([dayjs().startOf("year"), dayjs().endOf("year")]);
                break;
            default:
                break;
        }
    };

    const handleActionTypeChange = (e: RadioChangeEvent) => {
        const value = e.target.value as ActionType;
        setSelectedActionType(value);
    };

    const dataPie = {
        labels: ["Khen thưởng", "Kỷ luật"],
        datasets: [
            {
                label: "Báo cáo",
                data: [counts.rewardCount, counts.disciplineCount],
                backgroundColor: ["#4caf50", "#f44336"],
                hoverBackgroundColor: ["#45a049", "#f55a4e"],
            },
        ],
    };

    const optionsPie = {
        responsive: true,
        plugins: {
            legend: {
                position: "left" as const,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const total = counts.rewardCount + counts.disciplineCount;
                        const percentage = total ? ((tooltipItem.raw / total) * 100).toFixed(2) : 0;
                        return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                    },
                },
            },
        },
        maintainAspectRatio: false,
    };

    const dataBar = {
        labels: departments.map(dep => dep.name),
        datasets: [
            {
                label: "Số lượng hành động",
                data: departments.map(dep => departmentCounts[dep.id] || 0),
                backgroundColor: selectedActionType === ActionType.Reward ? "#4caf50" : "#f44336",
            },
        ],
    };

    const optionsBar = {
        indexAxis: 'y' as const,
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const total = Object.values(departmentCounts).reduce((a, b) => a + b, 0);
                        const percentage = total ? ((tooltipItem.raw / total) * 100).toFixed(2) : 0;
                        return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ marginLeft: '2%' }}>
            <h1>Báo cáo khen thưởng và kỷ luật</h1>
            <div style={{ marginBottom: 20 }}>
                <Radio.Group
                    value={filterType}
                    onChange={handleFilterChange}
                    style={{ marginRight: 10 }}
                >
                    <Radio.Button value="today">Hôm nay</Radio.Button>
                    <Radio.Button value="week">Tuần này</Radio.Button>
                    <Radio.Button value="month">Tháng này</Radio.Button>
                    <Radio.Button value="year">Năm này</Radio.Button>
                </Radio.Group>

                <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    style={{ marginRight: 10 }}
                />

                <Radio.Group
                    value={selectedActionType}
                    onChange={handleActionTypeChange}
                >
                    <Radio.Button value={ActionType.Reward}>Khen thưởng</Radio.Button>
                    <Radio.Button value={ActionType.Disciplinary}>Kỷ luật</Radio.Button>
                </Radio.Group>
            </div>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <Card title="Tổng số đơn" style={{ width: '22%' }}>
                            {totalCount}
                        </Card>
                        <Card title="Số đơn đang chờ duyệt" style={{ width: '22%' }}>
                            {pendingCount}
                        </Card>
                        <Card title="Số đơn đã duyệt" style={{ width: '22%' }}>
                            {approvedCount}
                        </Card>
                        <Card title="Số đơn đã từ chối" style={{ width: '22%' }}>
                            {rejectedCount}
                        </Card>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Card
                            title="Báo cáo Khen thưởng và Kỷ luật (Theo ngày thực hiện)"
                            style={{ width: '48%', marginRight: '2%' }}
                        >
                            <div style={{ position: 'relative', height: '300px' }}>
                                <Pie data={dataPie} options={optionsPie} />
                            </div>
                        </Card>

                        <Card
                            title={`Báo cáo theo phòng ban (${selectedActionType === ActionType.Reward ? 'Khen thưởng' : 'Kỷ luật'})`}
                            style={{ width: '48%' }}
                        >
                            <div style={{ position: 'relative', height: '300px' }}>
                                <Bar data={dataBar} options={optionsBar} />
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportPage;
