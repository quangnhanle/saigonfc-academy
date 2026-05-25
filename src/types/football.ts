export type PreferredFoot = "left" | "right" | "both";

export type RecordType = "time_seconds" | "success_attempt";

export const RECORD_TYPES: RecordType[] = ["time_seconds", "success_attempt"];

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
  time_seconds: "Thời gian",
  success_attempt: "Tỷ lệ thành công"
};

export const RECORD_TYPE_UNIT: Record<RecordType, string> = {
  time_seconds: "giây",
  success_attempt: "lần"
};

export const RECORD_TYPE_HINT: Record<RecordType, string> = {
  time_seconds: "Nhập số giây hoàn thành",
  success_attempt: "Nhập số lần thành công / số lần thử"
};

export function unitOf(recordType: RecordType): string {
  return RECORD_TYPE_UNIT[recordType];
}
