import { AlertCircle } from "lucide-react";
import { ComponentProps, FC } from "react";

interface TipsProps extends ComponentProps<"div"> {}

const Tips: FC<TipsProps> = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        Quick Tips
      </h2>
      <ul className="space-y-3">
        <li className="flex items-start gap-2 text-sm text-gray-600">
          <div className="w-5 h-5 flex items-center justify-center mt-0.5">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
          Meeting links are automatically generated
        </li>
        <li className="flex items-start gap-2 text-sm text-gray-600">
          <div className="w-5 h-5 flex items-center justify-center mt-0.5">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
          Calendar invitations sent instantly
        </li>
        <li className="flex items-start gap-2 text-sm text-gray-600">
          <div className="w-5 h-5 flex items-center justify-center mt-0.5">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
          Add meeting agenda in calendar invite
        </li>
      </ul>
    </div>
  );
};

export default Tips;
