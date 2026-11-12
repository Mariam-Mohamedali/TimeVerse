
using TimeVerse.Domain.Entities;

namespace TimeVerse.Application.Interfaces;

public interface IStudentRepository //mas2ol 3n el wsol ldata bta3t el student mn el database
{
    Task<Student?> GetByIdAsync(int id);
    Task<Student?> GetByEmailAsync(string email);
    Task<IEnumerable<Student>> GetAllAsync();

    Task AddAsync(Student student);
    void Update(Student student);
    void Delete(Student student);
}
