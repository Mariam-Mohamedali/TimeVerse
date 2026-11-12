using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimeVerse.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExamReminderSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExamId",
                table: "Notifications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StudentTaskId",
                table: "Notifications",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ExamId",
                table: "Notifications",
                column: "ExamId",
                unique: true,
                filter: "[ExamId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_StudentTaskId",
                table: "Notifications",
                column: "StudentTaskId",
                unique: true,
                filter: "[StudentTaskId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Exams_ExamId",
                table: "Notifications",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_StudentTasks_StudentTaskId",
                table: "Notifications",
                column: "StudentTaskId",
                principalTable: "StudentTasks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Exams_ExamId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_StudentTasks_StudentTaskId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ExamId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_StudentTaskId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ExamId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "StudentTaskId",
                table: "Notifications");
        }
    }
}
