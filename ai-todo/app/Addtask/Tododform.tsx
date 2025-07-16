'use client'
import React, { useState } from "react";
import axios from "axios";
import { ChevronDownIcon, CalendarIcon, Loader2 } from "lucide-react"; // Added Loader2 for loading spinner
import { Button } from "@/components/ui/button"; // Assuming these are correctly configured Shadcn components
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Loading from "./Loading";
// Helper function to format date for display
const formatDate = (date: Date | undefined): string => {
    return date ? date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Select date";
};

type TaskStatus = 'todo' | 'in-progress' | 'done';
type Tab = 'schedule' | 'status';

function TodoForm() {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [loading, setLoading] = useState(false); // Re-introduced loading state
    const [open, setOpen] = useState(false); // For calendar popover
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [priority, setPriority] = useState("high");
    const [status, setStatus] = useState<TaskStatus>('todo'); // Re-introduced status state
    const [selectedTab, setSelectedTab] = useState<Tab>('schedule'); // Re-introduced selectedTab state
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For success/error messages

    // Function to display messages temporarily
    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // Message disappears after 3 seconds
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        setMessage(null); // Clear previous messages

        const todoData = {
            task_name: taskTitle,
            description: taskDescription,
            priority: priority,
            status: status,
            scheduled_date: date ? date.toISOString().split('T')[0] : null,
            scheduled_time: (document.getElementById('time-picker') as HTMLInputElement)?.value || null,
        };

        console.log("Submitting Todo:", todoData);

        try {
            const response = await axios.post('http://localhost:8000/addtodo', todoData);
            console.log("Todo Saved:", response.data);
            setTaskTitle("");
            setTaskDescription("");
            setDate(undefined);
            setPriority("high");
            setStatus('todo');
            showMessage('success', "Task added successfully!");
        } catch (error: any) {
            console.error("Error saving todo:", error.response?.data || error.message);
            showMessage('error', "Failed to add task. Please check console for details.");
        } finally {
            setLoading(false);
        }
    }

    async function handleEnhance(event: React.MouseEvent) {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = {
            text: taskDescription,
        };

        try {
            const response = await axios.post('http://localhost:8000/enhance', data);
            if (response.data && response.data.enhanced_text) {
                setTaskDescription(response.data.enhanced_text);
                showMessage('success', "Description enhanced!");
            } else {
                console.error("Enhance API returned an unexpected response:", response.data);
                showMessage('error', "Failed to enhance description.");
            }
        } catch (error: any) {
            console.error("Error enhancing description:", error.response?.data || error.message);
            showMessage('error', `Error: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(event: React.MouseEvent) {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = {
            task_name: taskTitle,
        };

        try {
            const response = await axios.post('http://localhost:8000/create', data);
            console.log("Create API Response:", response.data);

            if (response.data && response.data.description) {
                setTaskDescription(response.data.description);
                showMessage('success', "Description generated!");
            } else {
                console.error("Create API returned an unexpected response:", response.data);
                showMessage('error', "Failed to generate description.");
            }
        } catch (error: any) {
            console.error("Error generating task description:", error.response?.data || error.message);
            showMessage('error', `Error: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    }

    const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriority(event.target.value);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value as TaskStatus);
    };

    return (
        <>
           

            <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-950 to-gray-800 text-white font-inter">
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Add New Task
                </h1>
                <form onSubmit={handleSubmit} className="relative bg-gray-900 border border-gray-700 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg backdrop-blur-sm bg-opacity-80">
                 
                    <div className="flex flex-col items-center gap-6">

                        {/* Schedule Buttons */}
                        <span className="text-xl sm:text-2xl font-semibold text-gray-200 mb-2">Schedule</span>
                       

                        <Input
                            type="text"
                            placeholder="Task Title"
                            className="p-3 border border-gray-700 rounded-lg w-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                            onChange={(e) => setTaskTitle(e.target.value)}
                            value={taskTitle}
                            disabled={loading}
                        />

                        <section className="flex flex-col w-full">
                            {loading ? <Loading /> : (
                            <textarea
                                placeholder="Task Description"
                                className="w-full h-28 sm:h-36 text-white rounded-lg p-3 border border-gray-700 bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y transition-all duration-200 text-sm sm:text-base"
                                onChange={(e) => setTaskDescription(e.target.value)}
                                value={taskDescription}
                                disabled={loading}
                            ></textarea>
                            )}
                            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
                                <Button
                                    type="button"
                                    onClick={handleEnhance}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg text-sm sm:text-base"
                                >
                                    Enhance
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg text-sm sm:text-base"
                                >
                                    Create
                                </Button>
                            </div>
                        </section>

                        {/* Priority Section */}
                        <section className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center mt-4 w-full justify-center">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-200">Priority</h1>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['high', 'medium', 'low'].map((p) => (
                                    <label
                                        key={p}
                                        className={`flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 text-sm sm:text-base
                                            ${priority === p ? 'bg-white/20 border-blue-500 shadow-md' : 'border-gray-700 hover:bg-white/10'}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            value={p}
                                            checked={priority === p}
                                            onChange={handlePriorityChange}
                                            className="hidden-radio"
                                            disabled={loading}
                                        />
                                        <span className={`font-medium ${p === 'high' ? 'text-red-400' : p === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Tab Navigation */}
                        <div className="flex w-full justify-center gap-3 sm:gap-6 mt-6 mb-4 border-b border-gray-700 pb-3">
                            <button
                                type="button"
                                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-t-lg font-semibold text-sm sm:text-base transition-all duration-300
                                    ${selectedTab === 'schedule' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                `}
                                onClick={() => setSelectedTab('schedule')}
                                disabled={loading}
                            >
                                Schedule
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-t-lg font-semibold text-sm sm:text-base transition-all duration-300
                                    ${selectedTab === 'status' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                `}
                                onClick={() => setSelectedTab('status')}
                                disabled={loading}
                            >
                                Status
                            </button>
                        </div>

                        {/* Conditional Rendering based on Tab */}
                        {selectedTab === 'schedule' && (
                            <section className="flex flex-col gap-5 sm:gap-7 w-full">
                                {/* Date and Time Pickers */}
                                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center text-black">
                                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                                        <Label htmlFor="date-picker" className="px-1 text-gray-200 text-sm sm:text-base">
                                            Date
                                        </Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date-picker"
                                                    className="w-full sm:w-40 md:w-48 justify-between font-normal bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-200 text-sm sm:text-base shadow-md"
                                                    disabled={loading}
                                                >
                                                    <CalendarIcon className="size-4 text-gray-400 mr-2" />
                                                    {formatDate(date)}
                                                    <ChevronDownIcon className="size-4 text-gray-400" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0 popover-content-custom" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    captionLayout="dropdown"
                                                    onSelect={(selectedDate) => {
                                                        setDate(selectedDate);
                                                        setOpen(false);
                                                    }}
                                                    initialFocus
                                                    className="rdp" // Apply custom styles to Calendar
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                                        <Label htmlFor="time-picker" className="px-1 text-gray-200 text-sm sm:text-base">
                                            Time
                                        </Label>
                                        <Input
                                            type="time"
                                            id="time-picker"
                                            step="1"
                                            defaultValue="10:30:00"
                                            className="bg-gray-800 text-white border-gray-700 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base shadow-md"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {selectedTab === 'status' && (
                            <section className="flex flex-col gap-5 w-full items-center">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-200">Task Status</h1>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {['todo', 'in-progress', 'done'].map((s) => (
                                        <label
                                            key={s}
                                            className={`flex items-center gap-2 border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 text-sm sm:text-base
                                                ${status === s ? 'bg-white/20 border-blue-500 shadow-md' : 'border-gray-700 hover:bg-white/10'}
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                value={s}
                                                checked={status === s}
                                                onChange={handleStatusChange}
                                                className="hidden-radio"
                                                disabled={loading}
                                            />
                                            <span className={`font-medium ${s === 'todo' ? 'text-blue-400' : s === 'in-progress' ? 'text-orange-400' : 'text-green-400'}`}>
                                                {s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Message Display */}
                        {message && (
                            <div
                                className={`mt-4 px-4 py-3 rounded-lg w-full text-center text-sm font-medium
                                    ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
                                `}
                                role="alert"
                            >
                                {message.text}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl text-lg font-semibold w-full flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                            {loading ? 'Adding Task...' : 'Add Task'}
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}

export default TodoForm;