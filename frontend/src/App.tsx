import React, { useState, useEffect } from 'react';
import { NavigationTab, Student, Course, Teacher, ScheduleItem, RecentActivityItem } from './types';

import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentPortal } from './components/StudentPortal';
import { StudentsDashboard } from './components/StudentsDashboard';
import { WhatsAppTemplateEditor } from './components/WhatsAppTemplateEditor';
import { ScheduleManager } from './components/ScheduleManager';
import { BrochureView } from './components/BrochureView';
import { CoursesView } from './components/CoursesView';
import { TeachersView } from './components/TeachersView';
import { SettingsView } from './components/SettingsView';
import { NewRegistrationModal } from './components/NewRegistrationModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { NewCourseModal } from './components/NewCourseModal';

const REACT_APP_BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || '';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState<'admin' | 'student' | 'teacher' | null>(() => {
    return localStorage.getItem('userRole') as 'admin' | 'student' | 'teacher' | null;
  });
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    const savedRole = localStorage.getItem('userRole');
    return savedRole === 'student' ? 'student-portal' : savedRole === 'teacher' ? 'teacher-dashboard' : 'dashboard';
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Restrict routes for student and teacher
  useEffect(() => {
    if (isLoggedIn) {
      if (userRole === 'student') {
        const allowedTabs: NavigationTab[] = ['student-portal'];
        if (!allowedTabs.includes(activeTab)) {
          setActiveTab('student-portal');
        }
      } else if (userRole === 'teacher') {
        const allowedTabs: NavigationTab[] = ['teacher-dashboard', 'schedule', 'courses', 'teachers', 'settings'];
        if (!allowedTabs.includes(activeTab)) {
          setActiveTab('teacher-dashboard');
        }
      }
    }
  }, [activeTab, userRole, isLoggedIn]);

  const currentStudentObj = students.find(s => s.username === currentUser);
  const studentName = currentStudentObj ? currentStudentObj.name : (userRole === 'student' ? 'Ana García López' : undefined);

  const handleLogin = (role: 'admin' | 'student' | 'teacher', username?: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
    if (username) {
      setCurrentUser(username);
      localStorage.setItem('username', username);
    } else {
      const defaultUser = role === 'student' ? 'ana.garcial.ms' : role === 'teacher' ? 'victor.maya' : 'admin';
      setCurrentUser(defaultUser);
      localStorage.setItem('username', defaultUser);
    }
    setActiveTab(role === 'admin' ? 'dashboard' : role === 'teacher' ? 'teacher-dashboard' : 'student-portal');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStudents, resCourses, resTeachers, resSchedule, resActivities] = await Promise.all([
          fetch(`${REACT_APP_BACKEND_URL}/api/students`),
          fetch(`${REACT_APP_BACKEND_URL}/api/courses`),
          fetch(`${REACT_APP_BACKEND_URL}/api/teachers`),
          fetch(`${REACT_APP_BACKEND_URL}/api/schedule`),
          fetch(`${REACT_APP_BACKEND_URL}/api/activities`),
        ]);

        const [studentsData, coursesData, teachersData, scheduleData, activitiesData] = await Promise.all([
          resStudents.json(),
          resCourses.json(),
          resTeachers.json(),
          resSchedule.json(),
          resActivities.json(),
        ]);

        setStudents(studentsData);
        setCourses(coursesData);
        setTeachers(teachersData);
        setScheduleItems(scheduleData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching data from backend:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleAddStudent = async (newStudent: Student) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(prev => [data.student, ...prev]);
        setActivities(prev => [data.activity, ...prev]);
      } else {
        console.error('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleUpdateStudentCredentials = async (
    studentId: string, 
    username: string, 
    tempPassword: string, 
    status: Student['status']
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/students/${studentId}/credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, tempPassword, status }),
      });
      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
        return true;
      } else {
        console.error('Failed to update student credentials');
        return false;
      }
    } catch (error) {
      console.error('Error updating student credentials:', error);
      return false;
    }
  };

  const handleAddScheduleItem = async (newItem: ScheduleItem) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const addedItem = await response.json();
        setScheduleItems(prev => [...prev, addedItem]);
        
        // Auto-update corresponding course's room, timeSlot, and teacher
        const startHrs = parseTimeToHours(addedItem.startTime);
        const endHrs = startHrs + addedItem.durationHours;
        const endHrsInt = Math.floor(endHrs);
        const endMins = Math.round((endHrs - endHrsInt) * 60);
        const timeSlotStr = `${addedItem.startTime} a ${String(endHrsInt).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
        
        await handleUpdateCourseSchedule(addedItem.title, addedItem.room, timeSlotStr, addedItem.teacher);
      } else {
        console.error('Failed to add schedule item');
      }
    } catch (error) {
      console.error('Error adding schedule item:', error);
    }
  };

  const handleClearScheduleForCourse = async (title: string, teacher: string, weekStartDate: string) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/schedule/course/${encodeURIComponent(title)}/teacher/${encodeURIComponent(teacher)}/week/${encodeURIComponent(weekStartDate)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setScheduleItems(prev => prev.filter(item => !(item.title === title && item.teacher === teacher && item.weekStartDate === weekStartDate)));
      } else {
        console.error('Failed to delete schedule items');
      }
    } catch (error) {
      console.error('Error deleting schedule items:', error);
    }
  };

  const parseTimeToHours = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return hours + minutes / 60;
      }
    }
    const val = parseFloat(timeStr);
    return isNaN(val) ? 0 : val;
  };

  const createScheduleItemsFromCourse = (course: Course) => {
    const timeSlot = course.timeSlot || '';
    
    // Parse day index
    let dayIndex = 0; // default Lunes
    const timeSlotLower = timeSlot.toLowerCase();
    if (timeSlotLower.includes('mar')) dayIndex = 1;
    else if (timeSlotLower.includes('mié') || timeSlotLower.includes('mie')) dayIndex = 2;
    else if (timeSlotLower.includes('jue')) dayIndex = 3;
    else if (timeSlotLower.includes('vie')) dayIndex = 4;
    else if (timeSlotLower.includes('sáb') || timeSlotLower.includes('sab')) dayIndex = 5;

    // Parse start and end times (e.g. "15:00 a 16:30")
    const timeMatches = timeSlot.match(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g);
    
    let startTime = '09:00';
    let durationHours = 1.5;

    if (timeMatches && timeMatches.length >= 1) {
      startTime = timeMatches[0];
      
      if (timeMatches.length >= 2) {
        const startHrs = parseTimeToHours(timeMatches[0]);
        const endHrs = parseTimeToHours(timeMatches[1]);
        if (endHrs > startHrs) {
          durationHours = endHrs - startHrs;
        }
      }
    } else {
      const hourMatches = timeSlot.match(/([0-9]+)/g);
      if (hourMatches && hourMatches.length >= 1) {
        let hr = parseInt(hourMatches[0], 10);
        if (timeSlotLower.includes('pm') && hr < 12) hr += 12;
        startTime = `${String(hr).padStart(2, '0')}:00`;
      }
    }

    const scheduleItem: ScheduleItem = {
      id: `sch-auto-${Date.now()}`,
      title: course.name,
      teacher: course.teacher,
      dayIndex: dayIndex,
      startTime: startTime,
      durationHours: durationHours,
      room: course.room || 'Aula Multiusos',
      colorTheme: 'navy',
      weekStartDate: '2026-08-17',
    };

    return scheduleItem;
  };

  const handleUpdateCourseSchedule = async (courseName: string, room: string, timeSlot: string, teacher?: string) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/courses/name/${encodeURIComponent(courseName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room, timeSlot, teacher }),
      });
      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
      } else {
        console.error('Failed to update course schedule');
      }
    } catch (error) {
      console.error('Error updating course schedule:', error);
    }
  };

  const handleResolveConflict = async (itemId: string) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/schedule/${itemId}/resolve`, {
        method: 'PUT',
      });
      if (response.ok) {
        const resolvedItem = await response.json();
        setScheduleItems(prev => prev.map(item => item.id === itemId ? resolvedItem : item));
      } else {
        console.error('Failed to resolve schedule conflict');
      }
    } catch (error) {
      console.error('Error resolving schedule conflict:', error);
    }
  };
  const handleAddCourse = async (newCourse: Course) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });
      if (response.ok) {
        const addedCourse = await response.json();
        setCourses(prev => [...prev, addedCourse]);
        
        // Auto-create schedule item from course details
        const autoScheduleItem = createScheduleItemsFromCourse(addedCourse);
        await handleAddScheduleItem(autoScheduleItem);
      } else {
        console.error('Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleAssignCourse = async (studentId: string, courseId: string) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/students/${studentId}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });
      if (response.ok) {
        setStudents(prev =>
          prev.map(s =>
            s.id === studentId
              ? { ...s, courseIds: [...(s.courseIds || []), courseId] }
              : s
          )
        );
      } else {
        console.error('Failed to assign course');
      }
    } catch (error) {
      console.error('Error assigning course:', error);
    }
  };

  const handleRemoveCourse = async (studentId: string, courseId: string) => {
    try {
      const response = await fetch(`${REACT_APP_BACKEND_URL}/api/students/${studentId}/courses/${courseId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStudents(prev =>
          prev.map(s =>
            s.id === studentId
              ? { ...s, courseIds: (s.courseIds || []).filter(id => id !== courseId) }
              : s
          )
        );
      } else {
        console.error('Failed to remove course');
      }
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };
  const handleDeleteStudent = async (studentId: string) => {
    try {
      const studentToDelete = students.find(s => s.id === studentId);
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(prev => prev.filter(s => s.id !== studentId));
        if (studentToDelete) {
          setActivities(prev => prev.filter(act => act.user !== studentToDelete.name && act.user !== studentToDelete.username));
        }
        if (data.activity) {
          setActivities(prev => [data.activity, ...prev]);
        }
      } else {
        console.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboard 
            setActiveTab={setActiveTab} 
            onOpenNewModal={() => setIsNewModalOpen(true)} 
            students={students}
            courses={courses}
            teachers={teachers}
            scheduleItems={scheduleItems}
          />
        );
      case 'teacher-dashboard':
        return (
          <TeacherDashboard
            currentUser={currentUser}
            teachers={teachers}
            courses={courses}
            scheduleItems={scheduleItems}
            students={students}
            onAddScheduleItem={handleAddScheduleItem}
            onClearSchedule={handleClearScheduleForCourse}
          />
        );
      case 'student-portal': {
        const studentCourses = courses.filter(c => currentStudentObj?.courseIds?.includes(c.id));
        return (
          <StudentPortal 
            student={currentStudentObj}
            courses={studentCourses} 
            setActiveTab={setActiveTab} 
            scheduleItems={scheduleItems}
          />
        );
      }
      case 'students':
        return (
          <StudentsDashboard 
            students={students}
            courses={courses}
            onOpenNewModal={() => setIsNewModalOpen(true)}
            onUpdateStudentCredentials={handleUpdateStudentCredentials}
            onAssignCourse={handleAssignCourse}
            onRemoveCourse={handleRemoveCourse}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'whatsapp':
        return <WhatsAppTemplateEditor />;
      case 'schedule':
        return (
          <ScheduleManager 
            scheduleItems={scheduleItems} 
            onAddScheduleItem={handleAddScheduleItem} 
            onResolveConflict={handleResolveConflict} 
            teachers={teachers}
          />
        );
      case 'courses':
        return (
          <CoursesView 
            courses={courses} 
            onOpenNewModal={() => setIsNewCourseModalOpen(true)} 
          />
        );
      case 'teachers':
        return <TeachersView teachers={teachers} />;
      case 'brochure':
        return <BrochureView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <AdminDashboard 
            setActiveTab={setActiveTab} 
            onOpenNewModal={() => setIsNewModalOpen(true)} 
            students={students}
            courses={courses}
            teachers={teachers}
            scheduleItems={scheduleItems}
          />
        );
    }
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} students={students} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-white text-brand-text dark:text-brand-text font-sans flex antialiased selection:bg-brand-red selection:text-white">
      {/* Navigation Sidebar */}
      <Sidebar 
        userRole={userRole}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenNewModal={() => setIsNewModalOpen(true)} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-[280px] min-w-0 transition-all">
        {/* Top Header */}
        <Header 
          userRole={userRole}
          studentName={studentName}
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenMobileMenu={() => setMobileOpen(true)} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* View Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
            </div>
          ) : (
            renderActiveView()
          )}
        </main>
      </div>

      {/* Quick Registration Modal */}
      {isNewModalOpen && (
        <NewRegistrationModal 
          isOpen={isNewModalOpen} 
          onClose={() => setIsNewModalOpen(false)} 
          onAddStudent={handleAddStudent} 
        />
      )}

      {/* New Course Modal */}
      {isNewCourseModalOpen && (
        <NewCourseModal
          isOpen={isNewCourseModalOpen}
          onClose={() => setIsNewCourseModalOpen(false)}
          onAddCourse={handleAddCourse}
          teachers={teachers}
        />
      )}
    </div>
  );
}
