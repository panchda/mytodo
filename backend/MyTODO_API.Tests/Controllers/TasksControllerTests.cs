using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyTODO_API.Controllers;
using MyTODO_API.Data;
using MyTODO_API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace MyTODO_API.Tests.Controllers
{
    public class TasksControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb_" + System.Guid.NewGuid())
                .Options;

            return new AppDbContext(options);
        }

        private TasksController GetControllerWithUser(AppDbContext context, int userId)
        {
            var controller = new TasksController(context);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString())
            }, "mock"));

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            return controller;
        }

        [Fact]
        public async Task GetTasks_ReturnsOnlyUserTasks()
        {
            var context = GetInMemoryDbContext();
            context.Tasks.AddRange(
                new TaskItem { Id = 1, Title = "User 1 Task", UserId = 1 },
                new TaskItem { Id = 2, Title = "User 2 Task", UserId = 2 }
            );
            await context.SaveChangesAsync();

            var controller = GetControllerWithUser(context, userId: 1);

            var result = await controller.GetTasks();

            var okResult = Assert.IsType<ActionResult<IEnumerable<TaskItem>>>(result);
            var returnValue = Assert.IsType<List<TaskItem>>(okResult.Value);
            Assert.Single(returnValue);
            Assert.Equal(1, returnValue.First().UserId);
        }

        [Fact]
        public async Task PostTaskItem_SetsUserId()
        {
            var context = GetInMemoryDbContext();
            var controller = GetControllerWithUser(context, userId: 5);

            var task = new TaskItem { Title = "New Task" };

            var result = await controller.PostTaskItem(task);

            var createdAt = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdTask = Assert.IsType<TaskItem>(createdAt.Value);

            Assert.Equal(5, createdTask.UserId);
            Assert.Equal("New Task", createdTask.Title);
        }

        [Fact]
        public async Task PutTaskItem_ReturnsBadRequest_WhenIdsMismatch()
        {
            var context = GetInMemoryDbContext();
            var controller = GetControllerWithUser(context, userId: 1);

            var task = new TaskItem { Id = 5, Title = "Wrong ID" };

            var result = await controller.PutTaskItem(6, task);

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task DeleteTaskItem_RemovesTask_WhenExists()
        {
            var context = GetInMemoryDbContext();
            var task = new TaskItem { Id = 1, Title = "To delete", UserId = 1 };
            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            var controller = GetControllerWithUser(context, userId: 1);

            var result = await controller.DeleteTaskItem(1);

            Assert.IsType<NoContentResult>(result);
            Assert.False(context.Tasks.Any(t => t.Id == 1));
        }
    }
}
