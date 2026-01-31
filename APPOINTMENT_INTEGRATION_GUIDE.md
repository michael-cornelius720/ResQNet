// Note: Due to the complexity of the hospital dashboard page,
// the appointments feature needs to be integrated into the hospital/page.tsx file.
// 
// IMPLEMENTATION STEPS:
//
// 1. The Appointment type has been added to hospital/page.tsx (lines 660-679)
// 2. State variables have been added (appointments, selectedAppointment, etc.)
//
// 3. ADD THIS CODE to hospital/page.tsx after the `addAmbulance` function (around line 883):

/*
  // Fetch appointments for this hospital
  const fetchAppointments = useCallback(async () => {
    if (!hospitalInfo) return;

    try {
      const res = await fetch(`/api/appointments?hospitalName=${encodeURIComponent(hospitalInfo.name)}&status=pending`);
      const data = await res.json();

      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  }, [hospitalInfo]);

  useEffect(() => {
    if (!hospitalInfo) return;

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, [hospitalInfo, fetchAppointments]);

  const openApproveModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowApproveModal(true);
    setAssignedDoctor('');
    setAppointmentDateTime('');
  };

  const approveAppointment = async () => {
    if (!selectedAppointment || !assignedDoctor || !appointmentDateTime) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAppointment.id,
          status: 'approved',
          assigned_doctor: assignedDoctor,
          appointment_time: appointmentDateTime,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Appointment approved successfully!');
        setShowApproveModal(false);
        fetchAppointments();
      } else {
        alert('Failed to approve appointment');
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
      alert('Failed to approve appointment');
    }
  };

  const rejectAppointment = async (appointmentId: string) => {
    const reason = prompt('Reason for rejection (optional):');
    
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: appointmentId,
          status: 'rejected',
          notes: reason || 'Appointment rejected',
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Appointment rejected');
        fetchAppointments();
      } else {
        alert('Failed to reject appointment');
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert('Failed to reject appointment');
    }
  };
*/

// 4. ADD THIS UI SECTION before the closing </main> tag and before the footer:

/*
        {/* APPOINTMENT REQUESTS SECTION */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg lg:rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
                Appointment Requests
              </h2>
            </div>
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 sm:px-4 lg:px-5 py-1.5 lg:py-2 rounded-full text-sm font-bold shadow-lg">
              {appointments.length} Pending
            </span>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-3 lg:space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-gradient-to-r from-gray-50 to-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-all shadow-md hover:shadow-lg"
                >
                  {/* Patient Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 lg:mb-5">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                        <h3 className="text-base sm:text-lg lg:text-xl font-black text-gray-900">
                          {appt.user_name || 'Patient'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span className="font-semibold">{appt.user_phone}</span>
                        </div>
                        {appt.blood_group && (
                          <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                            <span className="font-semibold">Blood: {appt.blood_group}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(appt.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Medical Issue */}
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="font-bold text-sm text-orange-900">Medical Issue:</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 ml-6">{appt.issue_type}</p>
                    {appt.description && (
                      <p className="text-sm text-gray-700 ml-6 mt-1">{appt.description}</p>
                    )}
                  </div>

                  {/* Medical Conditions */}
                  {appt.medical_conditions && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-sm text-blue-900">Medical History:</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-6">{appt.medical_conditions}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <button
                      onClick={() => openApproveModal(appt)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Assign
                    </button>
                    <button
                      onClick={() => rejectAppointment(appt.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <a
                      href={`https://www.google.com/maps?q=${appt.user_lat},${appt.user_lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      View Location
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No pending appointment requests</p>
            </div>
          )}
        </section>

        {/* APPROVAL MODAL */}
        {showApproveModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Approve Appointment</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Patient: <span className="font-bold text-gray-900">{selectedAppointment.user_name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Issue: <span className="font-bold text-gray-900">{selectedAppointment.issue_type}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Doctor <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={assignedDoctor}
                    onChange={(e) => setAssignedDoctor(e.target.value)}
                    placeholder="Dr. Smith"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date & Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={appointmentDateTime}
                    onChange={(e) => setAppointmentDateTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={approveAppointment}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Confirm Approval
                </button>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
*/

// IMPORTANT: You also need to add these imports at the top of hospital/page.tsx if not already present:
// import { Calendar, FileText, User, X } from 'lucide-react';
