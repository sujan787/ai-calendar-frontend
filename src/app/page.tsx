"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Brain,
  Bot,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import GoogleLoginButton, {
  GoogleIcon,
} from "@/components/google-login-button";
import { useAuth } from "@/api_hooks/use-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const { user, loginUser } = useAuth();
  const route = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white border-b border-gray-200 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Calendar</span>
          </div>
          <GoogleLoginButton
            onclick={() => (!user ? loginUser() : route.push("/dashboard"))}
          >
            {user ? (
              <>
                <LayoutDashboard />
                <span>Go To Dashboard</span>
              </>
            ) : (
              <>
                <GoogleIcon />
                <span>Sign in with Google</span>
              </>
            )}
          </GoogleLoginButton>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Intelligent Calendar Management
              <br />
              <span className="text-blue-600">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your scheduling experience with AI-driven insights and
              smart time management tools.
            </p>

            <GoogleLoginButton
              className=" px-8 py-4 rounded-lg text-lg font-semibold flex items-center mx-auto"
              onclick={() => (!user ? loginUser() : route.push("/dashboard"))}
            >
              Get Started <ChevronRight className="ml-2 h-5 w-5" />
            </GoogleLoginButton>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32">
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: "Smart Scheduling",
                description:
                  "AI-powered meeting time suggestions based on your preferences and availability",
              },
              {
                icon: <Bot className="h-8 w-8" />,
                title: "AI Assistant",
                description:
                  "Natural language processing for quick and efficient calendar management",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Time Analytics",
                description:
                  "Comprehensive insights into your time utilization and productivity patterns",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 text-blue-600">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AI Calendar?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience a smarter way to manage your time with our AI-powered
              calendar solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-gray-900 font-semibold">AI Calendar</span>
            </div>
            <p className="text-gray-600">
              © 2025 AI Calendar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
