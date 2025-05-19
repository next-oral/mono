"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { Avatar, AvatarFallback } from "@repo/design/components/ui/avatar";
import { Button } from "@repo/design/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { ChevronDownIcon, LogOutIcon } from "@repo/design/icons";

import { authClient } from "~/auth/client";

const Page = () => {
  const router = useRouter();
  const { data, error } = authClient.useSession();
  const handleGetStarted = () => setShowSecondScreen(true);
  const [showSecondScreen, setShowSecondScreen] = useState(false);

  const handleInvaildSession = useCallback(async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }, [router]);

  useEffect(() => {
    if (error) void handleInvaildSession();
  }, [data, error, handleInvaildSession]);

  if (!data) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="absolute right-0 z-9999 p-2">
        <UserAvatar email={data.user.email} onClick={handleInvaildSession} />
      </div>
      <AnimatePresence mode="wait">
        {!showSecondScreen ? (
          <motion.div
            key="welcome"
            className="absolute flex h-screen w-full flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background elements for parallax effect */}
            <motion.div
              className="absolute top-10 right-20 h-32 w-32 rounded-full bg-blue-100 opacity-40 blur-xl"
              initial={{ y: 0 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-indigo-100 opacity-40 blur-xl"
              initial={{ y: 0 }}
              animate={{ y: [0, 20, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            {/* Content with staggered animation */}
            <motion.div className="z-10 flex flex-col items-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    className="h-8 w-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </motion.div>
              </motion.div>

              <motion.h3
                className="mb-4 text-4xl font-medium text-blue-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Welcome to NextOral
              </motion.h3>

              <motion.p
                className="mb-8 max-w-md text-center text-lg text-blue-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                NextOral is a purpose-built system for managing and running your
                clinic. Streamline issues, bookings, and consultations.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  className="h-10 w-52 font-medium text-white shadow-lg"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="second-screen"
            className="absolute flex h-screen w-full items-center justify-center"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute h-full w-full bg-[radial-gradient(circle_500px_at_50%_200px,#4F46E5,transparent)]" />
              </div>
            </div>

            <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-8 rounded-xl bg-white p-4 shadow-xl"
              >
                <svg
                  className="mx-auto h-12 w-12 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>

              <motion.h3
                className="mb-4 text-center text-3xl font-medium text-blue-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Let's set up your clinic
              </motion.h3>

              <motion.p
                className="mb-8 text-center text-blue-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                We'll guide you through the steps to get your clinic management
                system up and running in minutes.
              </motion.p>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  className="border-blue-300 px-6 text-blue-700"
                  onClick={() => setShowSecondScreen(false)}
                >
                  Go Back
                </Button>

                <Button className="bg-blue-600 px-6 text-white hover:bg-blue-700">
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;

export function UserAvatar({
  email,
  onClick,
}: {
  email: string;
  onClick: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarFallback className="capitalize">
              {email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onClick}
          variant="destructive"
          className="cursor-pointer"
        >
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// import { useState } from "react"
// import { Button } from "@repo/design/components/ui/button"
// import { AnimatePresence, motion } from "motion/react"
// import { CheckIcon, ChevronRightIcon, UserIcon, BuildingIcon, ArrowLeftIcon } from "lucide-react"

// const Page = () => {
//     // Track the current step in the onboarding process
//     const [currentStep, setCurrentStep] = useState(0)

//     // Track form data (simplified for this example)
//     const [formData, setFormData] = useState({
//         profile: {
//             name: "",
//             email: "",
//             role: "",
//         },
//         organization: {
//             name: "",
//             type: "", // "single" or "multi"
//         },
//         clinic: {
//             name: "",
//             address: "",
//             specialization: "",
//         }
//     })

//     // Define the steps in the onboarding process
//     const steps = [
//         { id: 0, title: "Welcome", icon: "🏠" },
//         { id: 1, title: "Profile", icon: "👤" },
//         { id: 2, title: "Organization", icon: "🏢" },
//         { id: 3, title: "Clinic Setup", icon: "🏥" },
//         { id: 4, title: "Complete", icon: "✅" }
//     ]

//     // Handle navigation between steps
//     const nextStep = () => {
//         if (currentStep < steps.length - 1) {
//             setCurrentStep(currentStep + 1)
//         }
//     }

//     const prevStep = () => {
//         if (currentStep > 0) {
//             setCurrentStep(currentStep - 1)
//         }
//     }

//     // Render the appropriate step content
//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 0:
//                 return <WelcomeScreen onNext={nextStep} />
//             case 1:
//                 return <ProfileSetup onNext={nextStep} onBack={prevStep} />
//             case 2:
//                 return <OrganizationSetup onNext={nextStep} onBack={prevStep} />
//             case 3:
//                 return <ClinicSetup onNext={nextStep} onBack={prevStep} formData={formData} />
//             case 4:
//                 return <CompletionScreen />
//             default:
//                 return <WelcomeScreen onNext={nextStep} />
//         }
//     }

//     return (
//         <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-white to-blue-50">
//             {/* Progress indicator - Fixed at the top */}
//             {currentStep > 0 && currentStep < 4 && (
//                 <div className="absolute top-0 left-0 w-full px-6 py-4 bg-white/80 backdrop-blur-sm z-50">
//                     <div className="max-w-3xl mx-auto">
//                         <div className="flex items-center justify-between w-full">
//                             {steps.slice(1, 4).map((step) => (
//                                 <div key={step.id} className="flex flex-col items-center">
//                                     <div
//                                         className={`w-10 h-10 rounded-full flex items-center justify-center mb-1
//                                         ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
//                                     >
//                                         {currentStep > step.id ? (
//                                             <CheckIcon className="w-5 h-5" />
//                                         ) : (
//                                             step.icon
//                                         )}
//                                     </div>
//                                     <span className={`text-xs font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
//                                         {step.title}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="mt-2 h-1 bg-gray-200 rounded-full">
//                             <motion.div
//                                 className="h-full bg-blue-600 rounded-full"
//                                 initial={{ width: "0%" }}
//                                 animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
//                                 transition={{ duration: 0.3 }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Content area with page transitions */}
//             <AnimatePresence mode="wait">
//                 <motion.div
//                     key={currentStep}
//                     initial={{ opacity: 0, x: 100 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -100 }}
//                     transition={{
//                         type: "spring",
//                         stiffness: 300,
//                         damping: 30
//                     }}
//                     className="w-full h-screen flex items-center justify-center"
//                 >
//                     {renderStepContent()}
//                 </motion.div>
//             </AnimatePresence>
//         </div>
//     )
// }

// // Step 1: Welcome Screen
// const WelcomeScreen = ({ onNext }) => {
//     return (
//         <div className="flex flex-col items-center text-center max-w-lg mx-auto px-6">
//             {/* Background elements */}
//             <motion.div
//                 className="absolute top-10 right-20 w-32 h-32 rounded-full bg-blue-100 opacity-40 blur-xl"
//                 animate={{ y: [0, -15, 0] }}
//                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//             />
//             <motion.div
//                 className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-indigo-100 opacity-40 blur-xl"
//                 animate={{ y: [0, 20, 0] }}
//                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//             />

//             {/* Content with staggered animation */}
//             <motion.div
//                 className="w-20 h-20 mb-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                 </svg>
//             </motion.div>

//             <motion.h1
//                 className="text-4xl font-bold text-blue-900 mb-4"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.1, duration: 0.5 }}
//             >
//                 Welcome to NextOral
//             </motion.h1>

//             <motion.p
//                 className="text-xl text-blue-700 mb-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//             >
//                 Let's set up your dental clinic management system
//             </motion.p>

//             <motion.p
//                 className="text-gray-600 mb-10"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//             >
//                 This quick setup will guide you through:
//                 <div className="flex flex-col gap-2 mt-4 items-start text-left">
//                     <div className="flex items-center">
//                         <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">1</div>
//                         <span>Setting up your profile</span>
//                     </div>
//                     <div className="flex items-center">
//                         <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">2</div>
//                         <span>Creating your organization</span>
//                     </div>
//                     <div className="flex items-center">
//                         <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">3</div>
//                         <span>Configuring your clinic(s)</span>
//                     </div>
//                 </div>
//             </motion.p>

//             <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4, duration: 0.5 }}
//             >
//                 <Button
//                     onClick={onNext}
//                     className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700"
//                     whileHover={{ scale: 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                 >
//                     Get Started
//                 </Button>
//             </motion.div>
//         </div>
//     )
// }

// // Step 2: Profile Setup
// const ProfileSetup = ({ onNext, onBack }) => {
//     return (
//         <div className="w-full max-w-lg mx-auto px-6 pt-20">
//             <motion.div
//                 className="bg-white rounded-xl shadow-lg p-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-2xl font-bold text-blue-900 mb-6">Create Your Profile</h2>
//                 <p className="text-gray-600 mb-6">Tell us about yourself so we can personalize your experience.</p>

//                 <div className="space-y-4 mb-8">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                         <input
//                             type="text"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Dr. John Smith"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                         <input
//                             type="email"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="john@example.com"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Professional Role</label>
//                         <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
//                             <option value="">Select your role</option>
//                             <option value="dentist">Dentist</option>
//                             <option value="admin">Administrator</option>
//                             <option value="assistant">Dental Assistant</option>
//                             <option value="hygienist">Dental Hygienist</option>
//                             <option value="receptionist">Receptionist</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex justify-between">
//                     <Button
//                         variant="outline"
//                         onClick={onBack}
//                         className="px-4 py-2"
//                     >
//                         <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                         Back
//                     </Button>

//                     <Button
//                         onClick={onNext}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
//                     >
//                         Continue
//                         <ChevronRightIcon className="w-4 h-4 ml-2" />
//                     </Button>
//                 </div>
//             </motion.div>
//         </div>
//     )
// }

// // Step 3: Organization Setup
// const OrganizationSetup = ({ onNext, onBack }) => {
//     const [orgType, setOrgType] = useState("")

//     return (
//         <div className="w-full max-w-lg mx-auto px-6 pt-20">
//             <motion.div
//                 className="bg-white rounded-xl shadow-lg p-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-2xl font-bold text-blue-900 mb-6">Create Your Organization</h2>
//                 <p className="text-gray-600 mb-6">Tell us about your dental practice organization.</p>

//                 <div className="space-y-4 mb-8">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
//                         <input
//                             type="text"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Smile Bright Dental"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-3">Organization Type</label>
//                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <div
//                                 className={`border rounded-lg p-4 cursor-pointer transition-all ${orgType === "single" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
//                                 onClick={() => setOrgType("single")}
//                             >
//                                 <div className="flex items-center mb-2">
//                                     <div className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${orgType === "single" ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
//                                         {orgType === "single" && <div className="w-2 h-2 rounded-full bg-white"></div>}
//                                     </div>
//                                     <h3 className="font-medium">Single Clinic</h3>
//                                 </div>
//                                 <p className="text-sm text-gray-500">I have one location where I provide services</p>
//                             </div>

//                             <div
//                                 className={`border rounded-lg p-4 cursor-pointer transition-all ${orgType === "multi" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
//                                 onClick={() => setOrgType("multi")}
//                             >
//                                 <div className="flex items-center mb-2">
//                                     <div className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${orgType === "multi" ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
//                                         {orgType === "multi" && <div className="w-2 h-2 rounded-full bg-white"></div>}
//                                     </div>
//                                     <h3 className="font-medium">Multiple Clinics</h3>
//                                 </div>
//                                 <p className="text-sm text-gray-500">I have multiple locations under one organization</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex justify-between">
//                     <Button
//                         variant="outline"
//                         onClick={onBack}
//                         className="px-4 py-2"
//                     >
//                         <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                         Back
//                     </Button>

//                     <Button
//                         onClick={onNext}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
//                         disabled={!orgType}
//                     >
//                         Continue
//                         <ChevronRightIcon className="w-4 h-4 ml-2" />
//                     </Button>
//                 </div>
//             </motion.div>
//         </div>
//     )
// }

// // Step 4: Clinic Setup
// const ClinicSetup = ({ onNext, onBack, formData }) => {
//     return (
//         <div className="w-full max-w-lg mx-auto px-6 pt-20">
//             <motion.div
//                 className="bg-white rounded-xl shadow-lg p-8"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-2xl font-bold text-blue-900 mb-6">Set Up Your Clinic</h2>
//                 <p className="text-gray-600 mb-6">Provide details about your primary clinic location.</p>

//                 <div className="space-y-4 mb-8">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
//                         <input
//                             type="text"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Downtown Dental Center"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                         <input
//                             type="text"
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-2"
//                             placeholder="Street Address"
//                         />
//                         <div className="grid grid-cols-2 gap-2">
//                             <input
//                                 type="text"
//                                 className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="City"
//                             />
//                             <input
//                                 type="text"
//                                 className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Postal Code"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//                         <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
//                             <option value="">Select specialization</option>
//                             <option value="general">General Dentistry</option>
//                             <option value="pediatric">Pediatric Dentistry</option>
//                             <option value="orthodontics">Orthodontics</option>
//                             <option value="periodontics">Periodontics</option>
//                             <option value="endodontics">Endodontics</option>
//                             <option value="prosthodontics">Prosthodontics</option>
//                             <option value="oral-surgery">Oral Surgery</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex justify-between">
//                     <Button
//                         variant="outline"
//                         onClick={onBack}
//                         className="px-4 py-2"
//                     >
//                         <ArrowLeftIcon className="w-4 h-4 mr-2" />
//                         Back
//                     </Button>

//                     <Button
//                         onClick={onNext}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
//                     >
//                         Complete Setup
//                         <ChevronRightIcon className="w-4 h-4 ml-2" />
//                     </Button>
//                 </div>
//             </motion.div>
//         </div>
//     )
// }

// // Step 5: Completion Screen
// const CompletionScreen = () => {
//     return (
//         <div className="flex flex-col items-center text-center max-w-lg mx-auto px-6">
//             <motion.div
//                 className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-8"
//                 initial={{ scale: 0, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ type: "spring", stiffness: 200, damping: 10 }}
//             >
//                 <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//             </motion.div>

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//             >
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h1>
//                 <p className="text-xl text-gray-600 mb-8">Your NextOral system is ready to use</p>

//                 <div className="bg-blue-50 rounded-lg p-6 mb-8">
//                     <h3 className="font-medium text-blue-800 mb-3">What's Next?</h3>
//                     <ul className="text-left space-y-3">
//                         <li className="flex items-start">
//                             <div className="flex-shrink-0 h-6 w-6 text-blue-600">
//                                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <span className="ml-2">Invite your team members</span>
//                         </li>
//                         <li className="flex items-start">
//                             <div className="flex-shrink-0 h-6 w-6 text-blue-600">
//                                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <span className="ml-2">Set up your appointment calendar</span>
//                         </li>
//                         <li className="flex items-start">
//                             <div className="flex-shrink-0 h-6 w-6 text-blue-600">
//                                 <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <span className="ml-2">Import your patient database</span>
//                         </li>
//                     </ul>
//                 </div>

//                 <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700">
//                     Go to Dashboard
//                 </Button>
//             </motion.div>
//         </div>
//     )
// }

// export default Page
