import React, { useState } from 'react';
import { 
  UserCheck, 
  Upload, 
  Plus, 
  X, 
  Check, 
  FileText, 
  Github, 
  Globe, 
  Briefcase, 
  MapPin, 
  Award,
  DollarSign
} from 'lucide-react';
import { CandidateProfile as ProfileType } from '../types';

interface CandidateProfileProps {
  profile: ProfileType | null;
  onUpdateProfile: (data: Partial<ProfileType>) => Promise<void>;
  onUploadResume: (file: File) => Promise<void>;
}

export const CandidateProfileView: React.FC<CandidateProfileProps> = ({
  profile,
  onUpdateProfile,
  onUploadResume
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      setSavedSuccess(false);
      try {
        await onUploadResume(e.target.files[0]);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 5000);
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && profile) {
      const updated = Array.from(new Set([...profile.skills, newSkill.trim()]));
      onUpdateProfile({ skills: updated });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    if (profile) {
      onUpdateProfile({ skills: profile.skills.filter(s => s !== skill) });
    }
  };

  const handleAddRole = () => {
    if (newRole.trim() && profile) {
      const updated = Array.from(new Set([...profile.preferred_roles, newRole.trim()]));
      onUpdateProfile({ preferred_roles: updated });
      setNewRole('');
    }
  };

  const handleRemoveRole = (role: string) => {
    if (profile) {
      onUpdateProfile({ preferred_roles: profile.preferred_roles.filter(r => r !== role) });
    }
  };

  const handleAddLoc = () => {
    if (newLoc.trim() && profile) {
      const updated = Array.from(new Set([...profile.preferred_locations, newLoc.trim()]));
      onUpdateProfile({ preferred_locations: updated });
      setNewLoc('');
    }
  };

  const handleRemoveLoc = (loc: string) => {
    if (profile) {
      onUpdateProfile({ preferred_locations: profile.preferred_locations.filter(l => l !== loc) });
    }
  };

  if (!profile) {
    return <div className="text-center py-12 text-slate-400">Loading Candidate Profile...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Upload Success Alert */}
      {savedSuccess && (
        <div className="glass-panel bg-hive-emerald/10 border border-hive-emerald/40 rounded-2xl p-4 flex items-center justify-between text-xs text-hive-emerald animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-hive-emerald" />
            <span className="font-bold">
              🎉 Resume Parsed Successfully! Updated {profile.skills.length} skills, experience level ({profile.experience_level}), and target roles.
            </span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Resume Upload Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-hive-cyan/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-hive-cyan/10 border border-hive-cyan/40 flex items-center justify-center">
              <FileText className="w-7 h-7 text-hive-cyan" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Resume & Parse Candidate Profile</h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload PDF or TXT resume to automatically extract programming languages, frameworks, skills, and experience level.
              </p>
            </div>
          </div>

          <label className="bg-gradient-to-r from-hive-cyan to-hive-indigo hover:from-hive-cyan/90 hover:to-hive-indigo/90 text-dark-950 font-bold px-6 py-3 rounded-xl text-sm cursor-pointer transition shadow-lg shadow-hive-cyan/20 flex items-center space-x-2 whitespace-nowrap">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Parsing PDF...' : 'Upload Resume PDF'}</span>
            <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Candidate Info */}
        <div className="glass-panel rounded-2xl p-6 border border-dark-800 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-dark-800">
            <UserCheck className="w-5 h-5 text-hive-cyan" />
            <h3 className="font-bold text-white">Basic Profile</h3>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => onUpdateProfile({ full_name: e.target.value })}
              className="w-full bg-dark-950 text-slate-200 text-sm px-3.5 py-2 rounded-lg border border-dark-700 focus:border-hive-cyan outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Email</label>
            <input
              type="email"
              value={profile.email || ''}
              onChange={(e) => onUpdateProfile({ email: e.target.value })}
              className="w-full bg-dark-950 text-slate-200 text-sm px-3.5 py-2 rounded-lg border border-dark-700 focus:border-hive-cyan outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Experience Level</label>
            <select
              value={profile.experience_level}
              onChange={(e) => onUpdateProfile({ experience_level: e.target.value })}
              className="w-full bg-dark-950 text-slate-200 text-sm px-3.5 py-2 rounded-lg border border-dark-700 focus:border-hive-cyan outline-none"
            >
              <option value="Fresher">Fresher / Entry Level (0-1 yrs)</option>
              <option value="1-3 years">Junior Developer (1-3 yrs)</option>
              <option value="3-5 years">Mid-Level Engineer (3-5 yrs)</option>
              <option value="Senior">Senior Engineer (5+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Salary Expectation</label>
            <input
              type="text"
              value={profile.salary_expectation || ''}
              onChange={(e) => onUpdateProfile({ salary_expectation: e.target.value })}
              placeholder="e.g. ₹5,00,000 - ₹8,00,000 PA"
              className="w-full bg-dark-950 text-slate-200 text-sm px-3.5 py-2 rounded-lg border border-dark-700 focus:border-hive-cyan outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">GitHub Profile</label>
            <input
              type="text"
              value={profile.github_url || ''}
              onChange={(e) => onUpdateProfile({ github_url: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full bg-dark-950 text-slate-200 text-sm px-3.5 py-2 rounded-lg border border-dark-700 focus:border-hive-cyan outline-none"
            />
          </div>
        </div>

        {/* Right Column: Skills Matrix & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Skills Matrix */}
          <div className="glass-panel rounded-2xl p-6 border border-dark-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-hive-cyan" />
                <h3 className="font-bold text-white">Extracted Skills Matrix</h3>
              </div>
              <span className="text-xs text-slate-400">{profile.skills.length} skills parsed</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-hive-cyan/10 text-hive-cyan border border-hive-cyan/30"
                >
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Spring Boot, Docker, React)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 bg-dark-950 text-slate-200 text-sm px-3 py-1.5 rounded-lg border border-dark-700 focus:border-hive-cyan outline-none"
              />
              <button
                onClick={handleAddSkill}
                className="bg-dark-800 hover:bg-dark-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Preferred Roles & Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Preferred Roles */}
            <div className="glass-panel rounded-2xl p-6 border border-dark-800 space-y-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-hive-cyan" />
                <h4 className="font-bold text-sm text-white">Target Job Roles</h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {profile.preferred_roles.map((role, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-dark-850 border border-dark-700 text-xs text-slate-200">
                    <span>{role}</span>
                    <button onClick={() => handleRemoveRole(role)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2 pt-2">
                <input
                  type="text"
                  placeholder="Add target role..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                  className="flex-1 bg-dark-950 text-slate-200 text-xs px-2.5 py-1 rounded border border-dark-700 focus:border-hive-cyan outline-none"
                />
                <button onClick={handleAddRole} className="bg-dark-800 text-slate-200 px-2.5 py-1 rounded text-xs">Add</button>
              </div>
            </div>

            {/* Target Locations */}
            <div className="glass-panel rounded-2xl p-6 border border-dark-800 space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-hive-emerald" />
                <h4 className="font-bold text-sm text-white">Target Locations</h4>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {profile.preferred_locations.map((loc, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-hive-emerald/10 text-hive-emerald border border-hive-emerald/30 text-xs font-medium">
                    <span>{loc}</span>
                    <button onClick={() => handleRemoveLoc(loc)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2 pt-2">
                <input
                  type="text"
                  placeholder="Add target location..."
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLoc()}
                  className="flex-1 bg-dark-950 text-slate-200 text-xs px-2.5 py-1 rounded border border-dark-700 focus:border-hive-cyan outline-none"
                />
                <button onClick={handleAddLoc} className="bg-dark-800 text-slate-200 px-2.5 py-1 rounded text-xs">Add</button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
