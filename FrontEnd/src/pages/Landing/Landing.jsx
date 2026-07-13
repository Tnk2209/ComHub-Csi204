import React from 'react';
import { Cpu, Zap, Box, ArrowRight, Layers } from 'lucide-react';

function Landing({ onStartBuilding, onNavigate }) {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-gray-100 flex flex-col font-sans">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-[#00c2ff] text-xs font-semibold px-3 py-1 rounded-full mb-8">
          🚀 ยินดีต้อนรับสู่โปรเจกต์ ComHub csi 204
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
          จัดสเปคคอมพิวเตอร์อัจฉริยะ <br />
          <span className="text-[#00c2ff] bg-clip-text">และจำหน่ายอุปกรณ์ไอทีครบวงจร</span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 max-w-2xl leading-relaxed">
          แพลตฟอร์ม E-Commerce สำหรับคนรักคอมพิวเตอร์ประกอบ มาพร้อมระบบตรวจสอบความเข้ากันได้ (Compatibility Checker) 
          และระบบคำนวณกำลังไฟ (TDP Calculator) แบบเรียลไทม์เพื่อให้เครื่องของคุณเสถียรที่สุด
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={onStartBuilding}
            className="bg-[#00c2ff] hover:bg-[#00c2ff]/90 text-slate-950 text-base font-bold px-8 py-4 rounded transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            เริ่มต้นจัดสเปคคอมฯ (PC Builder)
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onNavigate('catalog')}
            className="bg-[#161a1f] hover:bg-[#1f242b] border border-[#222a36] hover:border-gray-600 text-white text-base font-medium px-8 py-4 rounded transition-all cursor-pointer"
          >
            สำรวจชิ้นส่วนในร้าน
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-[#161a1f] border border-[#222a36] p-6 rounded-lg hover:border-gray-700 transition-colors">
            <div className="text-[#00c2ff] text-2xl mb-3">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Compatibility Check</h3>
            <p className="text-sm text-gray-400">หมดห่วงเรื่องประกอบกันไม่ได้ ระบบตรวจสอบ Socket, Form Factor และพอร์ตเชื่อมให้อัตโนมัติ</p>
          </div>
          <div className="bg-[#161a1f] border border-[#222a36] p-6 rounded-lg hover:border-gray-700 transition-colors">
            <div className="text-[#00c2ff] text-2xl mb-3">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">TDP Power Analysis</h3>
            <p className="text-sm text-gray-400">คำนวณปริมาณไฟฟ้าสะสมของชิ้นส่วน และแนะพาวเวอร์ซัพพลายที่ปลอดภัยเผื่อกระแสไฟ 20%</p>
          </div>
          <div className="bg-[#161a1f] border border-[#222a36] p-6 rounded-lg hover:border-gray-700 transition-colors">
            <div className="text-[#00c2ff] text-2xl mb-3">
              <Box className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">UAT Quality Control</h3>
            <p className="text-sm text-gray-400">ติดตามสถานะการประกอบ 4 ขั้นตอน พร้อมรายงานทดสอบอุณหภูมิความร้อนจริงจากช่าง</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
