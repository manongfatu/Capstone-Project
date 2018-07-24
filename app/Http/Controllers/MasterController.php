<?php
namespace App\Http\Controllers;

use Session;
use Response;
use View;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Students;
use App\Grades;
use App\Eq;
use App\schoolyear;
use Maatwebsite\Excel\Facades\Excel;
use Hash;



class MasterController extends Controller
{

    function __construct(){
        $this->middleware('auth');
    }

	public function index(){
		
		return view('content.index');
	}

    public function defofterms(){
        
        return view('content.DefOfTerms');
    }

    public function ImportData(){
        
        return view('content.dataImport');
    }

	public function generateStudentsList() {
		
            $StudentList = DB::table('students')
 				->select('id','firstname','lastname','coursename','gender','age','yearlevel','section')
                ->orderBy('id','asc')
                ->get();
        return json_encode($StudentList);      
    }

    public function gendata($x) {
    
            $studentradarData['a'] = DB::table('eq')
                ->select('intrapersonal','interpersonal','stress','adapt','mood','total_eq')
                ->where('student_id','=', $x)
                ->get();

            $latestYear = DB::table('grades')
            ->leftJoin('eq', 'eq.student_id', '=', 'grades.student_id')
            ->leftJoin('schoolyear', 'grades.schoolyear', '=', 'schoolyear.id')
            ->whereBetween('grades.schoolyear', [10, 11])
            ->get();
            $studentradarData['b'] = $latestYear;

   


          
        return json_encode($studentradarData);
    }

     public function gendata2($x) {
    
            $studentGwaData = DB::table('grades')
                ->select('*')
                ->leftJoin('schoolyear', 'grades.schoolyear', '=', 'schoolyear.id')
                ->where('grades.student_id','=', $x)
                ->get();    
          
        return json_encode($studentGwaData);
    }

    public function dashboard(){
        // $totalStudent =  DB::table('students')
        // ->select('id')
        // ->get();

            $totalStudent = DB::table('grades')
            ->leftJoin('eq', 'eq.student_id', '=', 'grades.student_id')
            ->leftJoin('schoolyear', 'grades.schoolyear', '=', 'schoolyear.id')
            ->whereBetween('grades.schoolyear', [10, 11])
            ->get();
            

        return json_encode($totalStudent);

    }

 
       
    public function listOfStudents(){

    	return view('content.listOfStudents');
    }

    public function getPredictionData(){



    }


    public function studentProfile($holderID){
    	// $details = array(
    	// 		'name' => 'Jusin',
    	// 		'age' => '15',
    	// 		'characteristics' => 'pretty'
    	// 	);
    	// return view('content.studentProfile', ['details' => $details]);
    	    $studentProfile = DB::table('students')
 			->select('id','firstname','lastname','coursename','gender','age','yearlevel','section')
            ->where('id','=', $holderID)
            ->get();
            //hack
            // $studentRadarData = DB::table('eq')
            //    ->select('intrapersonal','interpersonal','stress','adapt','mood')
            //    ->where('student_id','=', $holderID)
            //    ->get();
           return view('content.studentProfile',[
                            'profile' => $studentProfile
                        ]);
    }

    public function endYear($start){

        $schoolYear = DB::table('schoolyear')
                ->groupBy('year')
                ->where('year', '>', $start)
                ->get();

            return json_encode($schoolYear);
    }

    public function endYear2($start){

        $schoolYear = DB::table('schoolyear')
                ->groupBy('year')
                ->where('year', '>', $start)
                ->get();

            return json_encode($schoolYear);
    }

    public function endYear3($start){

        $schoolYear = DB::table('schoolyear')
                ->select('id', 'year', 'semester')
                ->where('id', '>', $start)
                ->orderBy('id', 'asc')
                ->get();

            return json_encode($schoolYear);
    }

    public function getCurrentGraph($year, $comparedYear = null){
    $betweenYears = array();
    $betweenComparedYears = array();
    $betweenYearsPredict = array();

    $years =  DB::table('schoolyear')
             ->where('year', '=', $year)
             ->get();

    $currentYear = DB::table('schoolyear')
                ->orderBy('id','desc')
                ->take(3)
                ->get();



    $flagFirst = 0;
    foreach($years as $year){
        if($flagFirst == 0 || $flagFirst != count($years) - 1){
            $betweenYears[] = $year->id;
        }
        $flagFirst++;
    }


    if($comparedYear != null){         
        $comparedYear =  DB::table('schoolyear')
                         ->where('year', '=', $comparedYear)
                         ->get();

        $flagFirst = 0;
        foreach($comparedYear as $year){
            if($flagFirst == 0 || $flagFirst != count($years) - 1){
                $betweenComparedYears[] = $year->id;
            }
            $flagFirst++;
        }
    }

    $schoolYear = DB::table('grades')
        ->leftJoin('eq', 'eq.student_id', '=', 'grades.student_id')
        ->leftJoin('students', 'students.id', '=', 'grades.student_id')
        ->leftJoin('schoolyear', 'grades.schoolyear', '=', 'schoolyear.id')
        ->whereBetween('grades.schoolyear', $betweenYears)
        ->get();


    if($comparedYear != null){
        $schoolYear2 = DB::table('grades')
            ->leftJoin('eq', 'eq.student_id', '=', 'grades.student_id')
            ->leftJoin('students', 'students.id', '=', 'grades.student_id')
            ->leftJoin('schoolyear', 'grades.schoolyear', '=', 'schoolyear.id')
            ->whereBetween('grades.schoolyear', $betweenComparedYears)
            ->get();
    $pussy['b'] = $schoolYear2 ;
    
    }

    $date = date('Y');
    $currentSchoolYear = $date.'-'.($date + 1);
   
    $thisYears = DB::table('schoolyear')
            ->where('schoolyear.year', $currentSchoolYear)
            ->get();

        $flagYears = 0;
        $curriculumYears = array();
        foreach ($thisYears as $year) {
            if($flagYears < count($thisYears)-1){
                $curriculumYears[] = $year->id;
            }
        }


    $pussy['a'] = $schoolYear;
    $latestYear = DB::table('grades')
            ->leftJoin('eq', 'eq.student_id', '=', 'grades.student_id')
            ->leftJoin('schoolyear', 'grades.schoolyear', '=', 'schoolyear.id')
            ->whereBetween('grades.schoolyear', [10, 11])
            ->get();

   
    $pussy['c'] = $latestYear;

        
         return json_encode($pussy);
    }

  public function getSummaryGraph() {
    $betweenYears = [1,12];

    $schoolYear = DB::table('grades')
        ->leftJoin('students', 'students.id', '=', 'grades.student_id')
        ->leftJoin('eq', 'eq.student_id', '=', 'grades.student_id')
        ->leftJoin('schoolyear', 'grades.schoolyear', '=', 'schoolyear.id')
        ->whereBetween('grades.schoolyear', $betweenYears)
        ->get();

    return json_encode($schoolYear);

  }



  public function filterStudent() {
             $filterStudents = DB::table('schoolyear')
                ->groupBy('year')
                ->get();

                $gender = DB::table('students')
                ->select('id','gender')
                ->orderBy('id','asc')
                ->get();
            // return jason_encode($filter);
         return view('content.filterStudents',
            [
                'filter'=>$filterStudents,
                'gender'=>$gender
            ]);
}

public function importStudentInformation(Request $request){
    $test = "";
    if($request->hasFile("importedFile")){
        $path = $request->file("importedFile")->getRealPath();

        Excel::load($path, function($read) use($path){
    
            $excel = Excel::load($path)->get();

            $headers = $excel->first()->toArray();
          
            $read->each(function($sheet) use($headers){
                $headers = $sheet->getHeading();
                $sheet->each(function($row) use($headers){   
                 
                 $students = new Students;
                 $eq = new Eq;
                

                 $students->firstname = $row[$headers[1]];
                 $students->lastname = $row[$headers[2]];
                 $students->coursename = $row[$headers[3]];
                 $students->gender = $row[$headers[4]];
                 $students->age = $row[$headers[5]];
                 $students->yearlevel = $row[$headers[6]];
                 $students->section = $row[$headers[7]];

                 $students->save();

                 $eq->student_id = $students->id;
                 $eq->intrapersonal = $row[$headers[8]];
                 $eq->interpersonal = $row[$headers[9]];
                 $eq->stress = $row[$headers[10]];
                 $eq->adapt = $row[$headers[11]];
                 $eq->mood = $row[$headers[12]];
                 $eq->total_eq = $row[$headers[13]];

                 $eq->save();

                 $lastCount = 14;
                 

                 for($x = $lastCount ; $x < count($headers) ; $x++){
                    $grades = new Grades;

                    $explodeCurriculum = explode("_", $headers[$x]);
                
                    switch(count($explodeCurriculum)){
                        case 2 :
                            $year = $explodeCurriculum[0].'-'.($explodeCurriculum[0]+1);
                            $semester = ucfirst($explodeCurriculum[1]);

                            $schoolYear = Schoolyear::where('year', $year)
                                            ->where('semester', $semester)
                                            ->first();

                            if($row[$headers[$x]] != null){
                                $grades->student_id = $students->id;
                                $grades->schoolyear = $schoolYear->id;
                                $grades->gwa = $row[$headers[$x]];                 
                                
                                $grades->save();
                            }
                        
                                          
                            break;
                        case 3 :
                            $year = $explodeCurriculum[0].'-'.($explodeCurriculum[0]+1);
                            $semester = $explodeCurriculum[1].' '.ucfirst($explodeCurriculum[2].'ester');

                            $schoolYear = Schoolyear::where('year', $year)
                                            ->where('semester', $semester)
                                            ->first();

                            if($row[$headers[$x]] != null){
                                $grades->student_id = $students->id;
                                $grades->schoolyear = $schoolYear->id;
                                $grades->gwa = $row[$headers[$x]];                 
                                
                                $grades->save();
                            }

                            break;

                        default :

                            exit;
                    }

                 }

                }
            );
        });
        });
    }

    return redirect('/')->with("success", "The file imported successfully!");

}

public function informationPDF($year1, $year2 = null){
    if($year2 != null){
        return redirect('http://localhost/ease_itp_final/jpgraph/ease.php?q1='.$year1.'&q2='.$year2);
    }else{
        return redirect('http://localhost/ease_itp_final/jpgraph/ease.php?q1='.$year1);
    }
}

public function studentPDF($id){
  return redirect('http://localhost/ease_itp_final/jpgraph/student_profile.php?id='.$id);
}


}