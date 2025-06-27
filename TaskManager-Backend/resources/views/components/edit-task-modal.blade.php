<div
    x-data="{ show: false, taskId: null, title: '', status: 'pending' }"
    x-on:open-modal.window="show = true; taskId = $event.detail.taskId; title = $event.detail.taskTitle; status = $event.detail.taskStatus;"
    x-show="show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    x-cloak
>
    <div class="bg-white p-6 rounded shadow w-96">
        <h3 class="text-lg font-semibold mb-4">Edit Task</h3>

        <form :action="`/api/tasks/${taskId}`" method="POST" @submit.prevent="submitEdit">
            @csrf
            @method('PATCH')

            <div class="mb-4">
                <label class="block mb-1">Title</label>
                <input x-model="title" name="title" class="w-full border px-3 py-2 rounded" required />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Status</label>
                <select x-model="status" name="status" class="w-full border px-3 py-2 rounded">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div class="flex justify-end space-x-2">
                <button type="button" @click="show = false" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
            </div>
        </form>
    </div>

    <script>
        function submitEdit() {
            fetch(`/api/tasks/${this.taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify({ title: this.title, status: this.status })
            }).then(() => {
                location.reload(); // Or use Alpine to update in-place
            });
        }
    </script>
</div>
