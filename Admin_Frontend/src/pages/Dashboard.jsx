import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Scissors, Clock } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Today's Appointments"
          value="24"
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          trend="+12%"
        />
        <StatCard
          title="Total Revenue"
          value="$2,450"
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          trend="+8%"
        />
        <StatCard
          title="New Clients"
          value="18"
          icon={<Users className="h-6 w-6 text-purple-600" />}
          trend="+15%"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} {...appointment} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Services</h2>
          <div className="space-y-4">
            {popularServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
      </div>
      {icon}
    </div>
    <div className="flex items-center mt-4">
      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
      <span className="text-green-500 text-sm">{trend} from last week</span>
    </div>
  </div>
);

const AppointmentCard = ({ time, client, service, duration }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-4">
      <Clock className="h-5 w-5 text-gray-500" />
      <div>
        <p className="font-semibold text-gray-800">{time}</p>
        <p className="text-gray-600">{client}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-gray-800">{service}</p>
      <p className="text-gray-600">{duration} min</p>
    </div>
  </div>
);

const ServiceCard = ({ name, bookings, revenue }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-4">
      <Scissors className="h-5 w-5 text-gray-500" />
      <p className="font-semibold text-gray-800">{name}</p>
    </div>
    <div className="text-right">
      <p className="text-gray-800">{bookings} bookings</p>
      <p className="text-gray-600">${revenue}</p>
    </div>
  </div>
);

const appointments = [
  {
    id: 1,
    time: "10:00 AM",
    client: "Sarah Johnson",
    service: "Haircut & Style",
    duration: 60
  },
  {
    id: 2,
    time: "11:30 AM",
    client: "Mike Smith",
    service: "Beard Trim",
    duration: 30
  },
  {
    id: 3,
    time: "2:00 PM",
    client: "Emma Davis",
    service: "Color & Highlights",
    duration: 120
  }
];

const popularServices = [
  {
    id: 1,
    name: "Haircut & Style",
    bookings: 45,
    revenue: 1800
  },
  {
    id: 2,
    name: "Color Treatment",
    bookings: 32,
    revenue: 2880
  },
  {
    id: 3,
    name: "Beard Trim",
    bookings: 28,
    revenue: 560
  }
];

export default Dashboard;
