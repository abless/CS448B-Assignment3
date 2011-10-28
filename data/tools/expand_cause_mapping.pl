#!/usr/bin/perl

my %result;
while(<STDIN>)
{
    chomp;

    @row = split /;/;

    $code = $row[0];
    $desc = $row[2];
    if ($row[1] eq "")
    {
        next;
    }
    
    @causes = split /,/, $row[1];
    for (my $i = 0; $i <= $#causes; $i ++)
    {
        $cause = $causes[$i];
        $cause =~ s/^\s+//;
        if ($cause =~ m/([A-Z][0-9]+)-([A-Z][0-9]+)/)
        {
            $start = $1;
            $end = $2;
            for (my $j = substr($start, 0, 1); $j <= substr($end, 0, 1); $j ++)
            {
                my $first = 0;
                my $last = 99;
                if ($j == int($start[0]))
                {
                    $first = int(substr($start, 1));                    
                }
                if ($j == ($end[0]))
                {
                    $last = int(substr($end, 1));
                }
                for (my $k = $first; $k <= $last; $k ++)
                {
                    my $causeRec;
                    if ($k < 10)
                    {
                        $causeRec = $j."0".$k;
                    }
                    else
                    {
                        $causeRec = $j.$k;
                    }
                    print "$causeRec;$desc\n";
                        
                }
            }
        }
        else
        {
            print $cause.";$desc\n";
        }

    }
}


