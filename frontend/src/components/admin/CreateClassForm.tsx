import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateClassForm() {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Create Class</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="classTitle">Class Title</Label>
                    <Input id="classTitle" placeholder="Class title" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="initialEnrolledCount">Initial Enrolled Count</Label>
                    <Input id="initialEnrolledCount" type="number" defaultValue={0} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="classImageUrl">Class Image URL</Label>
                    <Input id="classImageUrl" placeholder="https://.../class.webp" />
                </div>
                <Button className="w-full bg-gray-500 hover:bg-gray-600">Create</Button>
            </div>
        </div>
    );
}
