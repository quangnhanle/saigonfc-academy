import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

export type RadarSkillData = {
  skill: string;
  studentScore: number;
  clubStandard: number;
};

type Props = {
  data: RadarSkillData[];
};

export function StudentSkillRadar({ data }: Props) {
  return (
    <div className="w-full h-[360px] sm:h-[440px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="rgba(244,244,238,0.12)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#F4F4EE", fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 120]}
            tick={{ fill: "#8A8A93", fontSize: 10 }}
            stroke="rgba(244,244,238,0.08)"
          />
          <Radar
            name="Tiêu chuẩn Saigon FC"
            dataKey="clubStandard"
            stroke="#F6C945"
            strokeWidth={2}
            fill="#F6C945"
            fillOpacity={0.18}
          />
          <Radar
            name="Điểm học viên"
            dataKey="studentScore"
            stroke="#F4F4EE"
            strokeWidth={2}
            fill="#F4F4EE"
            fillOpacity={0.28}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #26262E",
              backgroundColor: "#15151B",
              color: "#F4F4EE",
              boxShadow: "0 12px 32px -8px rgba(0,0,0,0.6)",
              fontSize: 12
            }}
            itemStyle={{ color: "#F4F4EE" }}
            labelStyle={{ color: "#F4F4EE", fontWeight: 700 }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}%`,
              name
            ]}
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              fontWeight: 600,
              paddingTop: 8,
              color: "#F4F4EE"
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
