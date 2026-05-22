export type PreferredFoot = "left" | "right" | "both";

export type RecordType =
  | "time_seconds"
  | "success_attempt"
  | "percentage"
  | "score";

export type SkillRating =
  | "Xuất sắc"
  | "Tốt"
  | "Đạt yêu cầu"
  | "Cần cải thiện";

export const SKILL_RATINGS: SkillRating[] = [
  "Xuất sắc",
  "Tốt",
  "Đạt yêu cầu",
  "Cần cải thiện"
];

export const PREFERRED_FOOT_LABEL: Record<PreferredFoot, string> = {
  left: "Chân trái",
  right: "Chân phải",
  both: "Hai chân"
};

export const RECORD_TYPE_LABEL: Record<RecordType, string> = {
  time_seconds: "Thời gian (giây)",
  success_attempt: "Tỉ lệ thành công",
  percentage: "Phần trăm (%)",
  score: "Thang điểm"
};

export const RECORD_TYPE_HINT: Record<RecordType, string> = {
  time_seconds: "Nhập số giây hoàn thành",
  success_attempt: "Nhập số lần thành công / số lần thử",
  percentage: "Nhập % từ 0–100",
  score: "Nhập điểm theo thang đã định"
};
