import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toaster";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import { User, Mail, Calendar, Shield, ArrowLeft } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users/me");
        setProfile(response.data.data);
      } catch (error) {
        toast({
          title: "Unable to load profile",
          description: error.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
        Profile data not available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your account</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Profile</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                <User className="h-10 w-10 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Welcome</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">{profile.fullName}</h2>
                <StatusBadge status={profile.role === "admin" ? "Admin" : "Employee"} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Email address</p>
                    <p className="mt-1 text-lg font-medium text-slate-950">{profile.email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Date of joining</p>
                    <p className="mt-1 text-lg font-medium text-slate-950">{formatDate(profile.dateOfJoining)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <Shield className="mt-1 h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Role</p>
                    <p className="mt-1 text-lg font-medium text-slate-950 capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Account status</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">Status</p>
                  <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <p className="text-sm font-medium text-emerald-700">Active</p>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div>
              <p className="text-sm font-semibold text-slate-700">Quick info</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-slate-600">Leave balance</p>
                  <p className="font-medium text-slate-950">{profile.leaveBalance} days</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-slate-600">Member since</p>
                  <p className="font-medium text-slate-950">
                    {new Date(profile.dateOfJoining).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="text-xs text-slate-600">
              <p>ID: {profile._id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
